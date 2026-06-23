import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import asar from 'asar';
import { backup } from './backup.js';
import { syncDomInjectionTranslation, DOM_INJECTION_OLD } from './dom_injector.js';
import {
  validateEncoding,
  detectGarbledText,
  autoRollbackOnFailure,
  isIdeOnlyKey
} from './safe_guard.js';

export function applyTranslationsToContent(content, sortedTranslations) {
  let result = content;
  let replacedCount = 0;
  let injectionPair = null;

  for (const pair of sortedTranslations) {
    // DOM 注入脚本必须最后应用：其内部包含所有字典键名的英文字符串，
    // 若先插入再执行后续 replaceAll，会破坏注入脚本的 JS 语法。
    if (pair.old === DOM_INJECTION_OLD) {
      injectionPair = pair;
      continue;
    }
    const nextContent = result.replaceAll(pair.old, pair.new);
    if (nextContent !== result) {
      result = nextContent;
      replacedCount++;
    }
  }

  // 注入脚本最后应用——此时原始内容中的英文已被替换，不会破坏脚本内部字典键
  if (injectionPair) {
    const nextContent = result.replaceAll(injectionPair.old, injectionPair.new);
    if (nextContent !== result) {
      result = nextContent;
      replacedCount++;
    }
  }

  return { content: result, replacedCount };
}

async function translateDesktop(config, translations, translationsPath) {
  const { asarPath, backupSuffix = '.bak', filesToTranslate = ['dist/main.js', 'dist/menu.js', 'dist/updater.js', 'dist/tray.js', 'dist/ipcHandlers.js', 'dist/loadingOverlay.js'] } = config;
  const backupPath = asarPath + backupSuffix;

  console.log('[INFO] 正在启动 Antigravity 桌面端汉化编译器...');

  // 编码校验
  if (translationsPath) {
    console.log('[SAFEGUARD] 正在执行词库文件编码校验...');
    const encodingResult = validateEncoding(translationsPath);
    if (!encodingResult.valid) {
      console.error('[SAFEGUARD] ❌ 词库文件编码校验未通过：' + encodingResult.error);
      return false;
    }
    console.log('[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。');
  }

  // 乱码扫描
  console.log('[SAFEGUARD] 正在执行词库乱码深度扫描...');
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error('[SAFEGUARD] ❌ 词库中检测到 ' + garbledResult.errors.length + ' 处乱码文本！');
    garbledResult.errors.forEach(err => {
      console.error('  ▶ [索引 ' + err.index + '] "' + err.text + '..."');
      console.error('    原因: ' + err.reason);
    });
    return false;
  }
  console.log('[SAFEGUARD] ✅ 词库乱码扫描通过。');

  // 备份原始 asar
  if (!fs.existsSync(asarPath)) {
    console.error('[ERROR] 找不到 asar 文件: "' + asarPath + '"');
    return false;
  }

  if (!fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(asarPath, backupPath);
      console.log('[OK] 原始 app.asar 已成功备份至 "' + backupPath + '"。');
    } catch (backupErr) {
      console.error('[ERROR] 备份 asar 文件失败:', backupErr.message);
      return false;
    }
  } else {
    console.log('[INFO] 检测到已有备份文件 "' + backupPath + '"，将其作为原始源使用。');
  }
  const sourceAsar = fs.existsSync(backupPath) ? backupPath : asarPath;

  // 同步 DOM 注入汉化脚本，确保 Web UI 词库始终来自结构化 dom_dictionary.js。
  syncDomInjectionTranslation(translations);
  if (translationsPath) {
    try { fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8'); }
    catch (e) { console.warn('[WARN] DOM 注入词库写回失败:', e.message); }
  }

  // 排序翻译词库（长字符串优先）
  const sortedTranslations = [...translations].sort((a, b) => b.old.length - a.old.length);

  // 读取并翻译所有目标文件
  console.log('[INFO] 正在从 asar 读取并翻译文件...');
  const translatedFiles = new Map();
  let totalReplaced = 0;

  for (const filePath of filesToTranslate) {
    let originalContent;
    try {
      const buf = asar.extractFile(sourceAsar, filePath);
      originalContent = buf.toString('utf8');
    } catch (e) {
      console.warn('[WARN] 文件 "' + filePath + '" 在 asar 中不存在或不可读，跳过。');
      continue;
    }

    const { content: newContent, replacedCount } = applyTranslationsToContent(originalContent, sortedTranslations);
    if (newContent !== originalContent) {
      translatedFiles.set(filePath, newContent);
      totalReplaced += replacedCount;
      console.log('  ✅ ' + filePath + ' 应用 ' + replacedCount + ' 条翻译');
    } else {
      console.log('  ⏭  ' + filePath + ' 无需翻译');
    }
  }

  // 统计未应用翻译
  const allOriginalContent = [];
  for (const filePath of filesToTranslate) {
    try {
      const buf = asar.extractFile(sourceAsar, filePath);
      allOriginalContent.push(buf.toString('utf8'));
    } catch (e) { /* skip */ }
  }
  const joinedOriginal = allOriginalContent.join('\n');
  const unappliedAbsolute = [];
  for (let i = 0; i < sortedTranslations.length; i++) {
    const pair = sortedTranslations[i];
    if (isIdeOnlyKey(pair.old)) {
      continue;
    }
    if (!joinedOriginal.includes(pair.old)) {
      unappliedAbsolute.push(pair);
    }
  }
  if (unappliedAbsolute.length > 0) {
    console.log('\n[WARN] 发现 ' + unappliedAbsolute.length + ' 组映射在 asar 所有文件中均未找到对应英文词条：');
    unappliedAbsolute.slice(0, 10).forEach((pair, index) => {
      const snippet = pair.old.substring(0, 60).replace(/\n/g, ' ');
      console.log('  ▶ [未匹配 ' + (index + 1) + '] "' + snippet + (pair.old.length > 60 ? '...' : '') + '"');
    });
    if (unappliedAbsolute.length > 10) {
      console.log('  ... 还有 ' + (unappliedAbsolute.length - 10) + ' 组未匹配');
    }
  }

  console.log('[INFO] 翻译完毕，共应用 ' + totalReplaced + ' 次映射。');

  // 如果没有任何文件需要更新，直接返回成功
  if (translatedFiles.size === 0) {
    console.log('[OK] 所有文件内容与原版一致，无需重新打包。汉化已完成（无变动）！');
    return true;
  }

  // 解包 asar 到临时目录
  console.log('[INFO] 正在解包原始 asar 到临时目录...');
  const resourcesDir = path.dirname(asarPath);
  const tempDir = path.join(resourcesDir, '_l10n_temp_asar_extract');
  const tempNewAsar = path.join(resourcesDir, '_l10n_new_app.asar');
  const originalUnpackedDir = asarPath + '.unpacked';
  const backupUnpackedDir = backupPath + '.unpacked';
  const tempNewUnpackedDir = tempNewAsar + '.unpacked';

  // 优先使用原始 unpacked 目录，其次使用备份 unpacked
  const sourceUnpackedDir = fs.existsSync(originalUnpackedDir)
    ? originalUnpackedDir
    : (fs.existsSync(backupUnpackedDir) ? backupUnpackedDir : null);

  // 递归复制目录函数
  function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        try {
          fs.copyFileSync(srcPath, destPath);
        } catch (e) { /* 忽略单个文件错误 */ }
      }
    }
  }

  try {
    // 清理旧临时文件
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    if (fs.existsSync(tempNewAsar)) {
      fs.unlinkSync(tempNewAsar);
    }
    if (fs.existsSync(tempNewUnpackedDir)) {
      fs.rmSync(tempNewUnpackedDir, { recursive: true, force: true });
    }

    // 解包使用当前 app.asar 路径，因为它才有配套的 app.asar.unpacked 同级目录；
    // 目标 JS 内容仍来自 sourceAsar（备份英文原版），随后会覆盖到 tempDir 中。
    asar.extractAll(asarPath, tempDir);

    // 防御性清理：若历史打包误把 app.asar.unpacked 当成普通条目塞进 asar 内容里，
    // extractAll 会在 tempDir 下还原出一个同名目录，必须先剔除，否则再次打包会继续膨胀。
    const staleUnpackedInTree = path.join(tempDir, 'app.asar.unpacked');
    if (fs.existsSync(staleUnpackedInTree)) {
      fs.rmSync(staleUnpackedInTree, { recursive: true, force: true });
      console.log('[INFO] 已剔除 asar 内残留的 app.asar.unpacked 冗余条目，避免打包膨胀。');
    }

    // 注意：磁盘上的 app.asar.unpacked/ 同级目录由 Electron 独立加载，
    // 不应复制进 tempDir，也不应纳入打包内容——否则 createPackage 会把它
    // 当作普通文件塞进 asar 头表，造成 302+ 条目膨胀。
    // （此处刻意不调用 copyDirSync(sourceUnpackedDir, ...)）

    // 覆盖翻译后的文件
    console.log('[INFO] 正在覆盖已汉化的文件...');
    for (const [filePath, newContent] of translatedFiles) {
      const fullPath = path.join(tempDir, filePath);
      fs.writeFileSync(fullPath, Buffer.from(newContent, 'utf8'));
    }

    // 语法校验（使用 acorn，避免受解包目录的 package.json 影响）
    console.log('[SAFEGUARD] 正在执行语法完整性校验...');
    let checkPassed = true;
    let acorn = null;
    try {
      acorn = await import('acorn');
    } catch (e) { /* acorn 不可用时回退到 node --check */ }

    for (const [filePath] of translatedFiles) {
      if (filePath.endsWith('.js')) {
        const fullPath = path.join(tempDir, filePath);
        const content = fs.readFileSync(fullPath, 'utf8');
        try {
          if (acorn && acorn.parse) {
            acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'script' });
          } else {
            // 用子进程执行 node --check，使用临时工作目录避免 package.json 干扰
            execSync('node --check "' + fullPath + '"', { stdio: 'pipe', cwd: path.dirname(fullPath) });
          }
        } catch (err) {
          console.error('[CRITICAL] ' + filePath + ' 语法校验失败！');
          console.error(err.message || err.stderr?.toString());
          checkPassed = false;
          break;
        }
      }
    }
    if (!checkPassed) {
      throw new Error('译后文件存在语法错误，已中止打包');
    }
    console.log('[SAFEGUARD] ✅ 所有汉化文件语法校验通过。');

    // 重新打包 asar。原版将 node_modules/** 放在 app.asar.unpacked 同级目录，
    // 这里必须保留该 unpack 策略；但不要把 app.asar.unpacked 目录本身复制进 tempDir。
    console.log('[INFO] 正在重新打包 asar...');
    try {
      await asar.createPackageWithOptions(tempDir, tempNewAsar, { unpackDir: 'node_modules/chrome-devtools-mcp' });
    } catch (packErr) {
      console.error('[ERROR] asar 模块 API 打包失败，尝试 npx CLI...');
      try {
        execSync('npx --yes asar pack "' + tempDir + '" "' + tempNewAsar + '" --unpack-dir "node_modules/chrome-devtools-mcp"', { stdio: 'pipe' });
      } catch (cliErr) {
        throw new Error('asar 打包失败（API 与 CLI 均失败）: ' + (cliErr.message || packErr.message));
      }
    }

    if (!fs.existsSync(tempNewAsar)) {
      throw new Error('新 asar 文件未生成，打包失败');
    }

    // 原子替换 - 备份旧的 asar 然后写入新 asar
    console.log('[SAFEGUARD] 正在执行原子替换写入 asar...');
    try {
      const oldBackup = asarPath + '.bak_last_good';
      if (fs.existsSync(oldBackup)) fs.unlinkSync(oldBackup);
      fs.copyFileSync(asarPath, oldBackup);
    } catch (e) { /* 忽略 */ }

    const newAsarBuf = fs.readFileSync(tempNewAsar);
    fs.writeFileSync(asarPath, newAsarBuf);
    try { asar.uncache(asarPath); } catch (e) { /* ignore */ }
    console.log('[SAFEGUARD] ✅ asar 已成功更新。');

    // app.asar.unpacked 同级目录无需同步——它从未进入打包流程，保持原样即可。

    // 清理临时目录
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      if (fs.existsSync(tempNewAsar)) fs.unlinkSync(tempNewAsar);
      if (fs.existsSync(tempNewUnpackedDir)) fs.rmSync(tempNewUnpackedDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn('[WARN] 清理临时文件失败:', cleanupErr.message);
    }

    console.log('[OK] Antigravity 桌面端汉化完成！请重启 Antigravity 以应用汉化。');
    return true;

  } catch (err) {
    console.error('[CRITICAL] 打包流程失败: ' + err.message);
    // 清理
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      if (fs.existsSync(tempNewAsar)) fs.unlinkSync(tempNewAsar);
      if (fs.existsSync(tempNewUnpackedDir)) fs.rmSync(tempNewUnpackedDir, { recursive: true, force: true });
    } catch (e) { /* ignore */ }
    // 从备份恢复
    if (fs.existsSync(backupPath)) {
      console.log('[INFO] 正在从备份恢复原始 asar...');
      fs.copyFileSync(backupPath, asarPath);
      console.log('[OK] 已恢复原版 asar。');
    }
    return false;
  }
}

function translateIDE(config, translations, translationsPath) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const backupPath = targetFilePath + backupSuffix;

  console.log('[INFO] 正在启动 Antigravity IDE 汉化编译器...');

  // 安全预检
  if (translationsPath) {
    console.log('[SAFEGUARD] 正在执行词库文件编码校验...');
    const encodingResult = validateEncoding(translationsPath);
    if (!encodingResult.valid) {
      console.error('[SAFEGUARD] ❌ 词库文件编码校验未通过：' + encodingResult.error);
      return false;
    }
    console.log('[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。');
  }

  console.log('[SAFEGUARD] 正在执行词库乱码深度扫描...');
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error('[SAFEGUARD] ❌ 词库中检测到 ' + garbledResult.errors.length + ' 处乱码文本！');
    garbledResult.errors.forEach(err => {
      console.error('  ▶ [索引 ' + err.index + '] "' + err.text + '..."');
      console.error('    原因: ' + err.reason);
    });
    return false;
  }
  console.log('[SAFEGUARD] ✅ 词库乱码扫描通过。');

  // 自动备份
  const backupSuccess = backup(config);
  if (!backupSuccess) {
    console.error('[ERROR] 备份失败，终止翻译。');
    return false;
  }

  // 读取主文件
  console.log('[INFO] 正在载入原始代码备份...');
  let content;
  try {
    content = fs.readFileSync(backupPath, 'utf8');
  } catch (err) {
    console.error('[ERROR] 读取备份文件失败:', err.message);
    return false;
  }

  const originalContent = content;

  // 预载入 workbench/extension/mainProcess 等其他文件
  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const workbenchBackupPath = workbenchPath + backupSuffix;
  let workbenchOriginalContent = '';
  if (fs.existsSync(workbenchPath)) {
    const sourcePath = fs.existsSync(workbenchBackupPath) ? workbenchBackupPath : workbenchPath;
    try { workbenchOriginalContent = fs.readFileSync(sourcePath, 'utf8'); } catch (e) { console.warn('[WARN] workbench 读取失败'); }
  }

  const checkExtensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');
  const checkExtensionBackupPath = checkExtensionPath + backupSuffix;
  let extensionOriginalContent = '';
  if (fs.existsSync(checkExtensionPath)) {
    const sourcePath = fs.existsSync(checkExtensionBackupPath) ? checkExtensionBackupPath : checkExtensionPath;
    try { extensionOriginalContent = fs.readFileSync(sourcePath, 'utf8'); } catch (e) { console.warn('[WARN] extension 读取失败'); }
  }

  const checkMainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');
  const checkMainProcessBackupPath = checkMainProcessPath + backupSuffix;
  let mainProcessOriginalContent = '';
  if (fs.existsSync(checkMainProcessPath)) {
    const sourcePath = fs.existsSync(checkMainProcessBackupPath) ? checkMainProcessBackupPath : checkMainProcessPath;
    try { mainProcessOriginalContent = fs.readFileSync(sourcePath, 'utf8'); } catch (e) { console.warn('[WARN] main.js 读取失败'); }
  }

  // 排序并应用翻译
  const sortedTranslations = [...translations].sort((a, b) => b.old.length - a.old.length);
  console.log('[INFO] 开始应用汉化词典 (共载入 ' + sortedTranslations.length + ' 组匹配)...');
  let replacedCount = 0;
  const unappliedAbsolute = [];

  for (let i = 0; i < sortedTranslations.length; i++) {
    const pair = sortedTranslations[i];
    const nextContent = content.replaceAll(pair.old, pair.new);
    if (nextContent !== content) {
      content = nextContent;
      replacedCount++;
    } else {
      if (!isIdeOnlyKey(pair.old)) {
        continue;
      }
      if (pair.old === 'void win.loadURL(url);' || 
          pair.old.includes('-placeholder-for-scanner') || 
          pair.old.includes('Autocomplete Speed') || 
          pair.old.includes('Sound Effects')) {
        continue;
      }
      if (!originalContent.includes(pair.old) && !workbenchOriginalContent.includes(pair.old) && !extensionOriginalContent.includes(pair.old) && !mainProcessOriginalContent.includes(pair.old)) {
        unappliedAbsolute.push(pair);
      } else {
        replacedCount++;
      }
    }
  }

  console.log('[INFO] 替换完毕，成功应用 ' + replacedCount + ' / ' + sortedTranslations.length + ' 组映射。');
  if (unappliedAbsolute.length > 0) {
    console.log('\n[WARN] 发现 ' + unappliedAbsolute.length + ' 组失效的映射：');
    unappliedAbsolute.slice(0, 20).forEach((pair, index) => {
      const snippet = pair.old.substring(0, 50).replace(/\n/g, ' ');
      console.log('  ▶ [失效 ' + (index + 1) + '] "' + snippet + (pair.old.length > 50 ? '...' : '') + '"');
    });
    console.log('\n');
  }

  // 安全写入主文件
  console.log('[SAFEGUARD] 正在执行主文件安全写入...');
  try {
    fs.writeFileSync(targetFilePath, content, 'utf8');
  } catch (err) {
    console.error('[SAFEGUARD] ❌ 主文件写入失败：' + err.message);
    autoRollbackOnFailure(config, err.message);
    return false;
  }
  console.log('[SAFEGUARD] ✅ 主文件安全写入成功！');

  // 对 workbench 应用汉化
  if (fs.existsSync(workbenchPath)) {
    console.log('[INFO] 正在载入 workbench 文件...');
    let workbenchContent;
    try {
      const sourcePath = fs.existsSync(workbenchBackupPath) ? workbenchBackupPath : workbenchPath;
      workbenchContent = fs.readFileSync(sourcePath, 'utf8');
    } catch (err) {
      console.error('[ERROR] 读取 workbench 失败:', err.message);
      return false;
    }

    let workbenchModified = false;
    let workbenchReplacedCount = 0;
    for (let i = 0; i < sortedTranslations.length; i++) {
      const pair = sortedTranslations[i];
      const nextContent = workbenchContent.replaceAll(pair.old, pair.new);
      if (nextContent !== workbenchContent) {
        workbenchContent = nextContent;
        workbenchReplacedCount++;
        workbenchModified = true;
      }
    }
    console.log('[INFO] workbench 应用 ' + workbenchReplacedCount + ' 组映射。');

    const targetPure = 'async _isPure(){const e=this.productService.checksums||{};await this.lifecycleService.when(4);const i=await Promise.all(Object.keys(e).map(r=>this._resolve(r,e[r])));let n=!0;for(let r=0,s=i.length;r<s;r++)if(!i[r].isPure){n=!1;break}return{isPure:n,proof:i}}';
    const replacementPure = 'async _isPure(){return{isPure:!0}}';
    if (workbenchContent.includes(targetPure)) {
      console.log('[INFO] 正在应用 workbench 纯净性检查绕过补丁...');
      workbenchContent = workbenchContent.replace(targetPure, replacementPure);
      workbenchModified = true;
    }

    if (workbenchModified) {
      console.log('[SAFEGUARD] 正在执行 workbench 安全写入...');
      try {
        fs.writeFileSync(workbenchPath, workbenchContent, 'utf8');
        console.log('[SAFEGUARD] ✅ workbench 安全写入成功！');
      } catch (err) {
        console.error('[SAFEGUARD] ❌ workbench 写入失败：' + err.message);
        autoRollbackOnFailure(config, err.message);
        return false;
      }
    } else {
      console.log('[INFO] workbench 无需修改。');
    }
  }

  // nls.messages.json 汉化
  const nlsPath = path.join(path.dirname(targetFilePath), '..', 'nls.messages.json');
  const nlsBackupPath = nlsPath + backupSuffix;
  if (fs.existsSync(nlsPath)) {
    let nlsData;
    try {
      const sourcePath = fs.existsSync(nlsBackupPath) ? nlsBackupPath : nlsPath;
      nlsData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    } catch (err) {
      console.error('[ERROR] 读取 nls.messages.json 失败:', err.message);
      return false;
    }

    if (Array.isArray(nlsData)) {
      const nlsMappings = [
        { index: 48, oldVal: 'now', newVal: '刚刚' },
        { index: 49, oldVal: '{0} second ago', newVal: '{0} 秒前' },
        { index: 50, oldVal: '{0} sec ago', newVal: '{0} 秒前' },
        { index: 51, oldVal: '{0} seconds ago', newVal: '{0} 秒前' },
        { index: 52, oldVal: '{0} secs ago', newVal: '{0} 秒前' },
        { index: 57, oldVal: '{0} minute ago', newVal: '{0} 分钟前' },
        { index: 58, oldVal: '{0} min ago', newVal: '{0} 分钟前' },
        { index: 59, oldVal: '{0} minutes ago', newVal: '{0} 分钟前' },
        { index: 60, oldVal: '{0} mins ago', newVal: '{0} 分钟前' },
        { index: 65, oldVal: '{0} hour ago', newVal: '{0} 小时前' },
        { index: 66, oldVal: '{0} hr ago', newVal: '{0} 小时前' },
        { index: 67, oldVal: '{0} hours ago', newVal: '{0} 小时前' },
        { index: 68, oldVal: '{0} hrs ago', newVal: '{0} 小时前' },
        { index: 73, oldVal: '{0} day ago', newVal: '{0} 天前' },
        { index: 74, oldVal: '{0} days ago', newVal: '{0} 天前' },
        { index: 4968, oldVal: 'Toggle Agent', newVal: '切换智能体' },
        { index: 3310, oldVal: 'Quick Open', newVal: '快速打开' },
        { index: 4206, oldVal: 'Quick Open', newVal: '快速打开' },
        { index: 4967, oldVal: 'Open Browser (Preview)', newVal: '打开浏览器 (预览)' },
        { index: 3104, oldVal: 'Profile', newVal: '个人资料' },
        { index: 4034, oldVal: 'Profile', newVal: '个人资料' },
        { index: 16330, oldVal: 'Profile', newVal: '个人资料' },
        { index: 5927, oldVal: 'Review', newVal: '审核' },
        { index: 8471, oldVal: 'Review', newVal: '审核' },
        { index: 6011, oldVal: '1 file changed', newVal: '1 个文件已更改' },
        { index: 6012, oldVal: '{0} files changed', newVal: '{0} 个文件已更改' },
        { index: 5746, oldVal: 'Changed 1 file', newVal: '已更改 1 个文件' },
        { index: 5747, oldVal: 'Changed {0} files', newVal: '已更改 {0} 个文件' },
        { index: 5008, oldVal: 'Open {0} User Settings', newVal: '打开 {0} 用户设置' },
        { index: 5015, oldVal: 'Quick Settings Panel', newVal: '快速设置面板' },
        { index: 5018, oldVal: 'Quick Settings Panel', newVal: '快速设置面板' },
        { index: 4978, oldVal: 'Docs', newVal: '文档' },
        { index: 4979, oldVal: 'Report Issue', newVal: '报告问题' },
        { index: 4980, oldVal: 'Changelog', newVal: '更新日志' },
        { index: 6128, oldVal: 'Limited', newVal: '受限' },
        { index: 6307, oldVal: 'Limited', newVal: '受限' },
        { index: 6309, oldVal: 'Limited', newVal: '受限' },
        { index: 5021, oldVal: 'Reset to default shortcuts', newVal: '重置为默认快捷键' },
        { index: 955, oldVal: 'Show more ({0})', newVal: '显示更多 ({0})' },
        { index: 5238, oldVal: 'Show more...', newVal: '显示更多...' },
        { index: 5239, oldVal: 'Show more...', newVal: '显示更多...' },
        { index: 9332, oldVal: 'Accept Changes', newVal: '接受更改' },
        { index: 4, oldVal: 'Error', newVal: '错误' },
        { index: 1185, oldVal: 'Error', newVal: '错误' },
        { index: 1756, oldVal: 'Error', newVal: '错误' },
        { index: 2196, oldVal: 'Error', newVal: '错误' },
        { index: 2198, oldVal: 'Error', newVal: '错误' },
        { index: 8630, oldVal: 'Error', newVal: '错误' },
        { index: 9956, oldVal: 'Error', newVal: '错误' },
        { index: 14084, oldVal: 'Errored', newVal: '出错' },
        { index: 2201, oldVal: 'Errors', newVal: '错误' },
        { index: 9784, oldVal: '1 Error', newVal: '1 个错误' },
        { index: 9785, oldVal: '{0} Errors', newVal: '{0} 个错误' },
        { index: 9721, oldVal: 'Errors: {0}', newVal: '错误: {0}' },
        { index: 2099, oldVal: 'Unknown Error', newVal: '未知错误' },
        { index: 12385, oldVal: 'Task "{0}" finished in {1}.', newVal: '任务"{0}"在 {1} 内完成。' },
        { index: 12386, oldVal: 'Task finished in {0}.', newVal: '任务在 {0} 内完成。' },
        { index: 5526, oldVal: 'Finished in {0}.', newVal: '在 {0} 内完成。' },
        { index: 5528, oldVal: 'Finished', newVal: '已完成' },
        { index: 5510, oldVal: 'Failed', newVal: '已失败' },
        { index: 3870, oldVal: 'Workspaces', newVal: '工作区' },
        { index: 3871, oldVal: 'Open Folder', newVal: '打开文件夹' },
        { index: 3872, oldVal: 'Clone Repository', newVal: '克隆仓库' },
        { index: 3873, oldVal: 'Open Fig Workspace', newVal: '打开 Fig 工作区' },
        { index: 3874, oldVal: 'Connect to Cloudtop', newVal: '连接至 Cloudtop' },
        { index: 3875, oldVal: 'Generate Project', newVal: '生成项目' },
        { index: 3876, oldVal: 'Open Folder', newVal: '打开文件夹' },
        { index: 3877, oldVal: 'Show All Recent Folders {0}', newVal: '显示所有最近文件夹 {0}' },
        { index: 3878, oldVal: 'Show More...', newVal: '显示更多...' },
        { index: 3879, oldVal: 'Google Extensions', newVal: 'Google 扩展' },
        { index: 3880, oldVal: 'Download', newVal: '下载' },
        { index: 3883, oldVal: 'Get Started', newVal: '开始使用' },
        { index: 3887, oldVal: 'Bring the full power of Google Data Cloud to your intelligent IDE.', newVal: '将 Google Data Cloud 的强大功能带入您的智能 IDE。' }
      ];

      let nlsModifiedCount = 0;
      nlsMappings.forEach(mapping => {
        let targetIndex = mapping.index;
        if (nlsData[targetIndex] !== mapping.oldVal) {
          const indices = [];
          let idx = nlsData.indexOf(mapping.oldVal);
          while (idx !== -1) {
            indices.push(idx);
            idx = nlsData.indexOf(mapping.oldVal, idx + 1);
          }
          if (indices.length > 0) {
            indices.sort((a, b) => Math.abs(a - mapping.index) - Math.abs(b - mapping.index));
            targetIndex = indices[0];
          } else {
            if (nlsData[targetIndex] === mapping.newVal) {
              nlsModifiedCount++;
              return;
            }
            console.warn('[WARN] nls.messages.json 索引 ' + mapping.index + ' 未匹配到 "' + mapping.oldVal + '"，且未在其他位置找到。');
            return;
          }
        }
        nlsData[targetIndex] = mapping.newVal;
        nlsModifiedCount++;
      });

      if (nlsModifiedCount > 0) {
        console.log('[INFO] nls.messages.json 汉化完成，成功更新 ' + nlsModifiedCount + ' 个条目。');
        try {
          fs.writeFileSync(nlsPath, JSON.stringify(nlsData), 'utf8');
          console.log('[SAFEGUARD] ✅ nls.messages.json 安全写入成功！');
        } catch (err) {
          console.error('[SAFEGUARD] ❌ nls.messages.json 写入失败：' + err.message);
          return false;
        }
      } else {
        console.log('[INFO] nls.messages.json 无需更新。');
      }
    }
  } else {
    console.warn('[WARN] 未找到 nls.messages.json。');
  }

  // CLP 缓存
  const clpDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'Antigravity IDE', 'clp') : 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';
  if (fs.existsSync(clpDir)) {
    console.log('[INFO] 正在扫描 CLP 缓存目录: "' + clpDir + '"...');
    const clpNlsFiles = [];
    function walkClp(dir) {
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          walkClp(fullPath);
        } else if (file.toLowerCase() === 'nls.messages.json') {
          clpNlsFiles.push(fullPath);
        }
      });
    }
    try { walkClp(clpDir); } catch (e) { console.warn('[WARN] 扫描 CLP 失败:', e.message); }

    console.log('[INFO] 找到 ' + clpNlsFiles.length + ' 个 CLP NLS 缓存文件。');

    for (const clpNlsPath of clpNlsFiles) {
      const clpNlsBackupPath = clpNlsPath + backupSuffix;
      let clpNlsData;
      try {
        const sourcePath = fs.existsSync(clpNlsBackupPath) ? clpNlsBackupPath : clpNlsPath;
        clpNlsData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      } catch (err) {
        console.error('[ERROR] 读取 CLP 文件失败: ' + clpNlsPath + ',', err.message);
        continue;
      }

      if (Array.isArray(clpNlsData)) {
        const clpMappings = [
          { index: 48, oldVal: 'now', newVal: '刚刚' },
          { index: 49, oldVal: '{0} second ago', newVal: '{0} 秒前' },
          { index: 50, oldVal: '{0} sec ago', newVal: '{0} 秒前' },
          { index: 51, oldVal: '{0} seconds ago', newVal: '{0} 秒前' },
          { index: 52, oldVal: '{0} secs ago', newVal: '{0} 秒前' },
          { index: 57, oldVal: '{0} minute ago', newVal: '{0} 分钟前' },
          { index: 58, oldVal: '{0} min ago', newVal: '{0} 分钟前' },
          { index: 59, oldVal: '{0} minutes ago', newVal: '{0} 分钟前' },
          { index: 60, oldVal: '{0} mins ago', newVal: '{0} 分钟前' },
          { index: 65, oldVal: '{0} hour ago', newVal: '{0} 小时前' },
          { index: 66, oldVal: '{0} hr ago', newVal: '{0} 小时前' },
          { index: 67, oldVal: '{0} hours ago', newVal: '{0} 小时前' },
          { index: 68, oldVal: '{0} hrs ago', newVal: '{0} 小时前' },
          { index: 73, oldVal: '{0} day ago', newVal: '{0} 天前' },
          { index: 74, oldVal: '{0} days ago', newVal: '{0} 天前' }
        ];
        let clpModifiedCount = 0;
        clpMappings.forEach(mapping => {
          const cur = clpNlsData[mapping.index];
          if (cur === mapping.oldVal) {
            clpNlsData[mapping.index] = mapping.newVal;
            clpModifiedCount++;
          }
        });

        if (clpModifiedCount > 0) {
          console.log('[INFO] CLP 文件汉化完成，成功更新 ' + clpModifiedCount + ' 个条目。');
          if (!fs.existsSync(clpNlsBackupPath)) {
            try { fs.copyFileSync(clpNlsPath, clpNlsBackupPath); }
            catch (backupErr) { console.error('[ERROR] 备份 CLP 失败:', backupErr.message); continue; }
          }
          try {
            fs.writeFileSync(clpNlsPath, JSON.stringify(clpNlsData), 'utf8');
            console.log('[SAFEGUARD] ✅ CLP 文件安全写入成功！');
          } catch (err) {
            console.error('[SAFEGUARD] ❌ CLP 写入失败：' + err.message);
            continue;
          }
        }
      }
    }
  }

  // extension.js
  const extensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');
  const extensionBackupPath = extensionPath + backupSuffix;
  if (fs.existsSync(extensionPath)) {
    if (!fs.existsSync(extensionBackupPath)) {
      try { fs.copyFileSync(extensionPath, extensionBackupPath); } catch (e) { console.error('[ERROR] 备份 extension.js 失败:', e.message); return false; }
    }
    let extensionContent;
    try { extensionContent = fs.readFileSync(extensionBackupPath, 'utf8'); } catch (err) { console.error('[ERROR] 读取 extension.js 失败:', err.message); return false; }
    let extModified = false, extReplacedCount = 0;
    for (let i = 0; i < sortedTranslations.length; i++) {
      const pair = sortedTranslations[i];
      const nextContent = extensionContent.replaceAll(pair.old, pair.new);
      if (nextContent !== extensionContent) { extensionContent = nextContent; extReplacedCount++; extModified = true; }
    }
    if (extModified) {
      console.log('[INFO] extension.js 应用 ' + extReplacedCount + ' 组映射，正在写入...');
      try {
        fs.writeFileSync(extensionPath, extensionContent, 'utf8');
        console.log('[SAFEGUARD] ✅ extension.js 安全写入成功！');
      } catch (err) {
        console.error('[SAFEGUARD] ❌ extension.js 写入失败：' + err.message);
        return false;
      }
    } else {
      console.log('[INFO] extension.js 无需修改。');
    }
  }

  // out/main.js
  const mainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');
  const mainProcessBackupPath = mainProcessPath + backupSuffix;
  if (fs.existsSync(mainProcessPath)) {
    if (!fs.existsSync(mainProcessBackupPath)) {
      try { fs.copyFileSync(mainProcessPath, mainProcessBackupPath); } catch (e) { console.error('[ERROR] 备份 main.js 失败:', e.message); return false; }
    }
    let mainProcessContent;
    try { mainProcessContent = fs.readFileSync(mainProcessBackupPath, 'utf8'); } catch (err) { console.error('[ERROR] 读取 main.js 失败:', err.message); return false; }
    let mpModified = false, mpReplacedCount = 0;
    for (let i = 0; i < sortedTranslations.length; i++) {
      const pair = sortedTranslations[i];
      const nextContent = mainProcessContent.replaceAll(pair.old, pair.new);
      if (nextContent !== mainProcessContent) { mainProcessContent = nextContent; mpReplacedCount++; mpModified = true; }
    }
    if (mpModified) {
      console.log('[INFO] out/main.js 应用 ' + mpReplacedCount + ' 组映射，正在写入...');
      try {
        fs.writeFileSync(mainProcessPath, mainProcessContent, 'utf8');
        console.log('[SAFEGUARD] ✅ out/main.js 安全写入成功！');
      } catch (err) {
        console.error('[SAFEGUARD] ❌ out/main.js 写入失败：' + err.message);
        return false;
      }
    } else {
      console.log('[INFO] out/main.js 无需修改。');
    }
  }

  // product.json 哈希更新
  try {
    console.log('[INFO] 正在更新完整性校验哈希...');
    const productPath = path.join(path.dirname(targetFilePath), '..', '..', 'product.json');
    if (fs.existsSync(productPath)) {
      const productData = JSON.parse(fs.readFileSync(productPath, 'utf8').replace(/\uFEFF/g, ''));
      if (productData.checksums) {
        const fileBuffer = fs.readFileSync(targetFilePath);
        const newHash = crypto.createHash('sha256').update(fileBuffer).digest('base64').replace(/=+$/, '');
        const oldHash = productData.checksums['jetskiAgent/main.js'];
        productData.checksums['jetskiAgent/main.js'] = newHash;
        console.log('[OK] jetskiAgent/main.js 哈希已更新: ' + oldHash + ' -> ' + newHash);
        if (fs.existsSync(workbenchPath)) {
          const wbBuffer = fs.readFileSync(workbenchPath);
          const newWbHash = crypto.createHash('sha256').update(wbBuffer).digest('base64').replace(/=+$/, '');
          const oldWbHash = productData.checksums['vs/workbench/workbench.desktop.main.js'];
          productData.checksums['vs/workbench/workbench.desktop.main.js'] = newWbHash;
          console.log('[OK] workbench 哈希已更新: ' + oldWbHash + ' -> ' + newWbHash);
        }
        fs.writeFileSync(productPath, JSON.stringify(productData, null, 2), 'utf8');
      }
    }
    console.log('[OK] IDE 汉化完成！请重启 Antigravity IDE 以应用汉化。');
    return true;
  } catch (err) {
    console.error('[ERROR] 更新哈希时发生错误:', err.message);
    return true;
  }
}

export async function translate(config, translations, translationsPath, targetType = 'antigravity') {
  if (targetType === 'antigravity') {
    return await translateDesktop(config, translations, translationsPath);
  } else if (targetType === 'ide') {
    return translateIDE(config, translations, translationsPath);
  } else {
    console.error('[CRITICAL] 未知目标类型: ' + targetType);
    return false;
  }
}
