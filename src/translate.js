import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { backup } from './backup.js';
import {
  validateEncoding,
  detectGarbledText,
  safeWriteWithValidation,
  autoRollbackOnFailure
} from './safe_guard.js';

/**
 * 核心汉化引擎：读取备份，安全匹配替换，写入主文件并更新完整性哈希
 * 
 * 🛡️ 安全加固版：集成多层防护机制
 *   - 翻译前：编码校验 + 乱码检测
 *   - 写入时：先写临时文件，校验通过后再替换正式文件
 *   - 失败时：自动回滚恢复出厂状态
 * 
 * @param {Object} config 配置参数 
 * @param {Array} translations 汉化词典列表 
 * @param {string} translationsPath 词库文件路径（用于编码预检）
 * @returns {boolean} 是否翻译成功
 */
export function translate(config, translations, translationsPath) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const backupPath = targetFilePath + backupSuffix;

  console.log(`[INFO] 正在启动汉化编译器...`);

  // ===== 🛡️ 安全预检阶段 =====

  // 0a. 编码一致性校验：确保词库文件为合法 UTF-8
  if (translationsPath) {
    console.log(`[SAFEGUARD] 正在执行词库文件编码校验...`);
    const encodingResult = validateEncoding(translationsPath);
    if (!encodingResult.valid) {
      console.error(`\x1b[31m[SAFEGUARD] ❌ 词库文件编码校验未通过：${encodingResult.error}\x1b[0m`);
      return false;
    }
    console.log(`[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。`);
  }

  // 0b. 乱码检测：扫描翻译文本中是否存在 GBK→UTF-8 二次转码乱码
  console.log(`[SAFEGUARD] 正在执行词库乱码深度扫描...`);
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 词库中检测到 ${garbledResult.errors.length} 处乱码文本！\x1b[0m`);
    garbledResult.errors.forEach(err => {
      console.error(`  ▶ [索引 ${err.index}] "${err.text}..."`);
      console.error(`    原因: ${err.reason}`);
    });
    console.error(`\x1b[31m[SAFEGUARD] 已强行拦截编译。请修正 translations.json 中的乱码后重试。\x1b[0m`);
    return false;
  }
  console.log(`[SAFEGUARD] ✅ 词库乱码扫描通过，未发现编码异常。`);

  // ===== 核心翻译阶段 =====

  // 1. 自动执行一次安全备份，确保有原始出厂备份存底
  const backupSuccess = backup(config);
  if (!backupSuccess) {
    console.error(`[ERROR] 备份失败，终止翻译以保护系统安全。`);
    return false;
  }

  // 2. 核心最佳实践：始终读取最干净的备份文件作为输入源，
  // 这样即便多次重复运行翻译，或者词库中途被微调，也不会造成脏替换冲突！
  console.log(`[INFO] 正在载入原始代码备份...`);
  let content;
  try {
    content = fs.readFileSync(backupPath, 'utf8');
  } catch (err) {
    console.error(`[ERROR] 读取备份文件失败:`, err.message);
    return false;
  }

  const originalContent = content; // 保留最原始备份内容，用于识别映射是否在源码中根本不存在

  // 2b. 预载入原始 workbench 代码，用于精准识别是否存在于 workbench (避免误报失效警告)
  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const workbenchBackupPath = workbenchPath + backupSuffix;
  let workbenchOriginalContent = '';
  if (fs.existsSync(workbenchPath)) {
    const sourcePath = fs.existsSync(workbenchBackupPath) ? workbenchBackupPath : workbenchPath;
    try {
      workbenchOriginalContent = fs.readFileSync(sourcePath, 'utf8');
    } catch (err) {
      console.warn(`[WARN] 预载入 workbench 备份文件失败:`, err.message);
    }
  }

  // 2c. 预载入原始 extension 代码，用于精准识别是否存在于 extension (避免误报失效警告)
  const checkExtensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');
  const checkExtensionBackupPath = checkExtensionPath + backupSuffix;
  let extensionOriginalContent = '';
  if (fs.existsSync(checkExtensionPath)) {
    const sourcePath = fs.existsSync(checkExtensionBackupPath) ? checkExtensionBackupPath : checkExtensionPath;
    try {
      extensionOriginalContent = fs.readFileSync(sourcePath, 'utf8');
    } catch (err) {
      console.warn(`[WARN] 预载入 extension 备份文件失败:`, err.message);
    }
  }

  // 2d. 预载入原始 mainProcess 代码，用于精准识别是否存在于 out/main.js (避免误报失效警告)
  const checkMainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');
  const checkMainProcessBackupPath = checkMainProcessPath + backupSuffix;
  let mainProcessOriginalContent = '';
  if (fs.existsSync(checkMainProcessPath)) {
    const sourcePath = fs.existsSync(checkMainProcessBackupPath) ? checkMainProcessBackupPath : checkMainProcessPath;
    try {
      mainProcessOriginalContent = fs.readFileSync(sourcePath, 'utf8');
    } catch (err) {
      console.warn(`[WARN] 预载入 main.js 备份文件失败:`, err.message);
    }
  }

  // 3. 执行翻译对照替换
  // 最佳实践：按照原始代码段 (old) 的长度进行由长到短 of 降序排序。
  // 这能强力确保包含子短语的长句（如长反馈文本段落）在子短语（如 "Allow", "Deny", "Actual behavior"）被翻译前，
  // 得到优先完整匹配并汉化。从而完美避开因短条目提前全局替换把长句"撕碎"导致的汉化失效，最大化匹配成功率！
  const sortedTranslations = [...translations].sort((a, b) => b.old.length - a.old.length);

  console.log(`[INFO] 开始应用汉化词典 (共载入 ${sortedTranslations.length} 组匹配，已智能完成长度降序重排)...`);
  let replacedCount = 0;
  const unappliedAbsolute = []; // 源码中完全不存在的失效映射
  
  for (let i = 0; i < sortedTranslations.length; i++) {
    const pair = sortedTranslations[i];
    const nextContent = content.replaceAll(pair.old, pair.new);
    if (nextContent !== content) {
      content = nextContent;
      replacedCount++;
    } else {
      // 检查该词条是否在原始源码、workbench 源码、extension 源码或 main.js 主进程源码中都完全不存在
      if (!originalContent.includes(pair.old) && 
          !workbenchOriginalContent.includes(pair.old) && 
          !extensionOriginalContent.includes(pair.old) &&
          !mainProcessOriginalContent.includes(pair.old)) {
        unappliedAbsolute.push(pair);
      } else {
        // 如果原始代码、workbench 代码、extension 代码或 mainProcess 代码里有，但当前 content 中已经找不到了，
        // 说明它作为子词条已被前序更长的词条合并替换，或者活跃在其他模块中。计入匹配成功数。
        replacedCount++;
      }
    }
  }

  console.log(`[INFO] 替换完毕，成功应用 ${replacedCount} / ${sortedTranslations.length} 组映射。`);

  if (unappliedAbsolute.length > 0) {
    console.log(`\n\x1b[33m[WARN] 发现 ${unappliedAbsolute.length} 组失效的映射 (源码中均未找到对应的英文词条，可能已过期)：\x1b[0m`);
    unappliedAbsolute.forEach((pair, index) => {
      const snippet = pair.old.substring(0, 50).replace(/\n/g, ' ');
      console.log(`  ▶ [失效 ${index + 1}] "${snippet}${pair.old.length > 50 ? '...' : ''}"`);
    });
    console.log(`\x1b[33m[TIP] 建议根据需要，从 translations.json 中清理这些已失效的词条。\x1b[0m\n`);
  }


  // ===== 🛡️ 安全写入阶段：先写临时文件，校验通过后再替换 =====
  console.log(`[SAFEGUARD] 正在执行安全写入（暂存 → 校验 → 替换）...`);
  const writeResult = safeWriteWithValidation(targetFilePath, content, backupPath);

  if (!writeResult.success) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 安全写入失败：${writeResult.error}\x1b[0m`);
    // 自动回滚
    autoRollbackOnFailure(config, writeResult.error);
    return false;
  }

  console.log(`[SAFEGUARD] ✅ 安全写入成功！译后文件已通过全部预检。`);
  console.log(`[OK] 汉化代码已成功写入运行库。`);

  // 4b. 对 workbench.desktop.main.js 应用汉化与纯净性绕过补丁
  if (fs.existsSync(workbenchPath)) {
    console.log(`[INFO] 正在载入原始 workbench 代码...`);
    let workbenchContent;
    try {
      // 始终从干净的备份文件读取以避免重复打补丁造成污染
      const sourcePath = fs.existsSync(workbenchBackupPath) ? workbenchBackupPath : workbenchPath;
      workbenchContent = fs.readFileSync(sourcePath, 'utf8');
    } catch (err) {
      console.error(`[ERROR] 读取 workbench 文件失败:`, err.message);
      return false;
    }

    let workbenchModified = false;

    // 对 workbench.desktop.main.js 应用 translations.json 中的汉化词典
    console.log(`[INFO] 开始对 workbench.desktop.main.js 应用汉化词典...`);
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
    console.log(`[INFO] workbench.desktop.main.js 汉化替换完毕，成功应用 ${workbenchReplacedCount} 组映射。`);

    const targetPure = 'async _isPure(){const e=this.productService.checksums||{};await this.lifecycleService.when(4);const i=await Promise.all(Object.keys(e).map(r=>this._resolve(r,e[r])));let n=!0;for(let r=0,s=i.length;r<s;r++)if(!i[r].isPure){n=!1;break}return{isPure:n,proof:i}}';
    const replacementPure = 'async _isPure(){return{isPure:!0}}';

    if (workbenchContent.includes(targetPure)) {
      console.log(`[INFO] 正在应用 workbench.desktop.main.js 纯净性检查绕过补丁...`);
      workbenchContent = workbenchContent.replace(targetPure, replacementPure);
      workbenchModified = true;
    } else {
      if (workbenchContent.includes(replacementPure)) {
        console.log(`[INFO] workbench 绕过补丁已经存在。`);
      } else {
        console.warn(`[WARN] 找不到 workbench 纯净性检查方法特征码，跳过绕过补丁。`);
      }
    }

    if (workbenchModified) {
      console.log(`[SAFEGUARD] 正在执行 workbench 安全写入...`);
      const wbWriteResult = safeWriteWithValidation(workbenchPath, workbenchContent, workbenchBackupPath);
      if (!wbWriteResult.success) {
        console.error(`\x1b[31m[SAFEGUARD] ❌ workbench 安全写入失败：${wbWriteResult.error}\x1b[0m`);
        autoRollbackOnFailure(config, wbWriteResult.error);
        return false;
      }
      console.log(`[SAFEGUARD] ✅ workbench 安全写入成功！已通过全部预检。`);
    } else {
      console.log(`[INFO] workbench.desktop.main.js 无需修改，跳过写入。`);
    }
  } else {
    console.warn(`[WARN] 未找到 workbench 文件: "${workbenchPath}"，跳过补丁与汉化应用。`);
  }

  // 4c. 对 nls.messages.json 进行特定索引的汉化替换
  const nlsPath = path.join(path.dirname(targetFilePath), '..', 'nls.messages.json');
  const nlsBackupPath = nlsPath + backupSuffix;

  if (fs.existsSync(nlsPath)) {
    console.log(`[INFO] 正在载入 nls.messages.json...`);
    let nlsData;
    try {
      const sourcePath = fs.existsSync(nlsBackupPath) ? nlsBackupPath : nlsPath;
      nlsData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    } catch (err) {
      console.error(`[ERROR] 读取或解析 nls.messages.json 失败:`, err.message);
      return false;
    }

    if (Array.isArray(nlsData)) {
      console.log(`[INFO] 开始对 nls.messages.json 应用汉化映射...`);
      const nlsMappings = [
        { index: 48, oldVal: "now", newVal: "刚刚" },
        { index: 49, oldVal: "{0} second ago", newVal: "{0} 秒前" },
        { index: 50, oldVal: "{0} sec ago", newVal: "{0} 秒前" },
        { index: 51, oldVal: "{0} seconds ago", newVal: "{0} 秒前" },
        { index: 52, oldVal: "{0} secs ago", newVal: "{0} 秒前" },
        { index: 57, oldVal: "{0} minute ago", newVal: "{0} 分钟前" },
        { index: 58, oldVal: "{0} min ago", newVal: "{0} 分钟前" },
        { index: 59, oldVal: "{0} minutes ago", newVal: "{0} 分钟前" },
        { index: 60, oldVal: "{0} mins ago", newVal: "{0} 分钟前" },
        { index: 65, oldVal: "{0} hour ago", newVal: "{0} 小时前" },
        { index: 66, oldVal: "{0} hr ago", newVal: "{0} 小时前" },
        { index: 67, oldVal: "{0} hours ago", newVal: "{0} 小时前" },
        { index: 68, oldVal: "{0} hrs ago", newVal: "{0} 小时前" },
        { index: 73, oldVal: "{0} day ago", newVal: "{0} 天前" },
        { index: 74, oldVal: "{0} days ago", newVal: "{0} 天前" },
        { index: 4968, oldVal: "Toggle Agent", newVal: "切换智能体" },
        { index: 3310, oldVal: "Quick Open", newVal: "快速打开" },
        { index: 4206, oldVal: "Quick Open", newVal: "快速打开" },
        { index: 4967, oldVal: "Open Browser (Preview)", newVal: "打开浏览器 (预览)" },
        { index: 3104, oldVal: "Profile", newVal: "个人资料" },
        { index: 4034, oldVal: "Profile", newVal: "个人资料" },
        { index: 16330, oldVal: "Profile", newVal: "个人资料" },
        { index: 5927, oldVal: "Review", newVal: "审核" },
        { index: 8471, oldVal: "Review", newVal: "审核" },
        { index: 6011, oldVal: "1 file changed", newVal: "1 个文件已更改" },
        { index: 6012, oldVal: "{0} files changed", newVal: "{0} 个文件已更改" },
        { index: 5746, oldVal: "Changed 1 file", newVal: "已更改 1 个文件" },
        { index: 5747, oldVal: "Changed {0} files", newVal: "已更改 {0} 个文件" },
        { index: 5008, oldVal: "Open {0} User Settings", newVal: "打开 {0} 用户设置" },
        { index: 5015, oldVal: "Quick Settings Panel", newVal: "快速设置面板" },
        { index: 5018, oldVal: "Quick Settings Panel", newVal: "快速设置面板" },
        { index: 4978, oldVal: "Docs", newVal: "文档" },
        { index: 4979, oldVal: "Report Issue", newVal: "报告问题" },
        { index: 4980, oldVal: "Changelog", newVal: "更新日志" },
        { index: 6128, oldVal: "Limited", newVal: "受限" },
        { index: 6307, oldVal: "Limited", newVal: "受限" },
        { index: 6309, oldVal: "Limited", newVal: "受限" },
        { index: 5021, oldVal: "Reset to default shortcuts", newVal: "重置为默认快捷键" },
        { index: 955, oldVal: "Show more ({0})", newVal: "显示更多 ({0})" },
        { index: 5238, oldVal: "Show more...", newVal: "显示更多..." },
        { index: 5239, oldVal: "Show more...", newVal: "显示更多..." },
        { index: 9332, oldVal: "Accept Changes", newVal: "接受更改" },
        { index: 4, oldVal: "Error", newVal: "错误" },
        { index: 1185, oldVal: "Error", newVal: "错误" },
        { index: 1756, oldVal: "Error", newVal: "错误" },
        { index: 2196, oldVal: "Error", newVal: "错误" },
        { index: 2198, oldVal: "Error", newVal: "错误" },
        { index: 8630, oldVal: "Error", newVal: "错误" },
        { index: 9956, oldVal: "Error", newVal: "错误" },
        { index: 14084, oldVal: "Errored", newVal: "出错" },
        { index: 2201, oldVal: "Errors", newVal: "错误" },
        { index: 9784, oldVal: "1 Error", newVal: "1 个错误" },
        { index: 9785, oldVal: "{0} Errors", newVal: "{0} 个错误" },
        { index: 9721, oldVal: "Errors: {0}", newVal: "错误: {0}" },
        { index: 2099, oldVal: "Unknown Error", newVal: "未知错误" },
        { index: 12385, oldVal: "Task \"{0}\" finished in {1}.", newVal: "任务“{0}”在 {1} 内完成。" },
        { index: 12386, oldVal: "Task finished in {0}.", newVal: "任务在 {0} 内完成。" },
        { index: 5526, oldVal: "Finished in {0}.", newVal: "在 {0} 内完成。" },
        { index: 5528, oldVal: "Finished", newVal: "已完成" },
        { index: 5510, oldVal: "Failed", newVal: "已失败" },
        { index: 3870, oldVal: "Workspaces", newVal: "工作区" },
        { index: 3871, oldVal: "Open Folder", newVal: "打开文件夹" },
        { index: 3872, oldVal: "Clone Repository", newVal: "克隆仓库" },
        { index: 3873, oldVal: "Open Fig Workspace", newVal: "打开 Fig 工作区" },
        { index: 3874, oldVal: "Connect to Cloudtop", newVal: "连接至 Cloudtop" },
        { index: 3875, oldVal: "Generate Project", newVal: "生成项目" },
        { index: 3876, oldVal: "Open Folder", newVal: "打开文件夹" },
        { index: 3877, oldVal: "Show All Recent Folders {0}", newVal: "显示所有最近文件夹 {0}" },
        { index: 3878, oldVal: "Show More...", newVal: "显示更多..." },
        { index: 3879, oldVal: "Google Extensions", newVal: "Google 扩展" },
        { index: 3880, oldVal: "Download", newVal: "下载" },
        { index: 3882, oldVal: "Set up your AI Security Companion to start detecting vulnerabilities.", newVal: "设置您的 AI 安全助手以开始检测漏洞。" },
        { index: 3883, oldVal: "Get Started", newVal: "开始使用" },
        { index: 3887, oldVal: "Bring the full power of Google Data Cloud to your intelligent IDE.", newVal: "将 Google Data Cloud 的强大功能带入您的智能 IDE。" }
      ];

      let nlsModifiedCount = 0;
      nlsMappings.forEach(mapping => {
        if (nlsData[mapping.index] === mapping.oldVal) {
          nlsData[mapping.index] = mapping.newVal;
          nlsModifiedCount++;
        } else if (nlsData[mapping.index] === mapping.newVal) {
          // Already translated, do nothing
        } else {
          console.warn(`[WARN] nls.messages.json 索引 ${mapping.index} 现为 "${nlsData[mapping.index]}"，与预期 "${mapping.oldVal}" 不符，跳过。`);
        }
      });

      if (nlsModifiedCount > 0) {
        console.log(`[INFO] nls.messages.json 汉化完成，成功更新 ${nlsModifiedCount} 个条目。`);
        console.log(`[SAFEGUARD] 正在执行 nls.messages.json 安全写入...`);
        const nlsContent = JSON.stringify(nlsData);
        const nlsWriteResult = safeWriteWithValidation(nlsPath, nlsContent, nlsBackupPath);
        if (!nlsWriteResult.success) {
          console.error(`\x1b[31m[SAFEGUARD] ❌ nls.messages.json 安全写入失败：${nlsWriteResult.error}\x1b[0m`);
          autoRollbackOnFailure(config, nlsWriteResult.error);
          return false;
        }
        console.log(`[SAFEGUARD] ✅ nls.messages.json 安全写入成功！`);
      } else {
        console.log(`[INFO] nls.messages.json 所有条目已处于汉化状态，无需重写。`);
      }
    } else {
      console.warn(`[WARN] nls.messages.json 根对象不是 Array，跳过汉化。`);
    }
  } else {
    console.warn(`[WARN] 未找到 nls.messages.json 文件: "${nlsPath}"，跳过逆波兰或汉化应用。`);
  }

  // 4d. 对 Roaming AppData 中的 CLP (Cached Language Pack) 缓存 NLS 文件进行特定索引的汉化替换
  const clpDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'Antigravity IDE', 'clp') : 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';
  if (fs.existsSync(clpDir)) {
    console.log(`[INFO] 正在扫描 CLP 缓存目录: "${clpDir}"...`);
    const clpNlsFiles = [];
    
    function walkClp(dir) {
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          walkClp(fullPath);
        } else {
          if (file.toLowerCase() === 'nls.messages.json') {
            clpNlsFiles.push(fullPath);
          }
        }
      });
    }
    
    try {
      walkClp(clpDir);
    } catch (walkErr) {
      console.warn(`[WARN] 扫描 CLP 目录失败:`, walkErr.message);
    }

    console.log(`[INFO] 找到 ${clpNlsFiles.length} 个 CLP NLS 缓存文件。`);

    for (const clpNlsPath of clpNlsFiles) {
      const clpNlsBackupPath = clpNlsPath + backupSuffix;
      console.log(`[INFO] 正在处理 CLP 文件: "${clpNlsPath}"...`);

      let clpNlsData;
      try {
        const sourcePath = fs.existsSync(clpNlsBackupPath) ? clpNlsBackupPath : clpNlsPath;
        clpNlsData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      } catch (err) {
        console.error(`[ERROR] 读取或解析 CLP 文件失败: ${clpNlsPath},`, err.message);
        continue;
      }

      if (Array.isArray(clpNlsData)) {
        const clpMappings = [
          { index: 48, oldVal: "now", newVal: "刚刚" },
          { index: 49, oldVal: "{0} second ago", newVal: "{0} 秒前" },
          { index: 50, oldVal: "{0} sec ago", newVal: "{0} 秒前" },
          { index: 51, oldVal: "{0} seconds ago", newVal: "{0} 秒前" },
          { index: 52, oldVal: "{0} secs ago", newVal: "{0} 秒前" },
          { index: 57, oldVal: "{0} minute ago", newVal: "{0} 分钟前" },
          { index: 58, oldVal: "{0} min ago", newVal: "{0} 分钟前" },
          { index: 59, oldVal: "{0} minutes ago", newVal: "{0} 分钟前" },
          { index: 60, oldVal: "{0} mins ago", newVal: "{0} 分钟前" },
          { index: 65, oldVal: "{0} hour ago", newVal: "{0} 小时前" },
          { index: 66, oldVal: "{0} hr ago", newVal: "{0} 小时前" },
          { index: 67, oldVal: "{0} hours ago", newVal: "{0} 小时前" },
          { index: 68, oldVal: "{0} hrs ago", newVal: "{0} 小时前" },
          { index: 73, oldVal: "{0} day ago", newVal: "{0} 天前" },
          { index: 74, oldVal: "{0} days ago", newVal: "{0} 天前" },
          { index: 4968, oldVal: "Toggle Agent", newVal: "切换智能体" },
          { index: 3310, oldVal: "Quick Open", newVal: "快速打开" },
          { index: 4206, oldVal: "Quick Open", newVal: "快速打开" },
          { index: 4967, oldVal: "Open Browser (Preview)", newVal: "打开浏览器 (预览)" },
          { index: 3104, oldVal: "Profile", newVal: "个人资料" },
          { index: 4034, oldVal: "Profile", newVal: "个人资料" },
          { index: 16330, oldVal: "Profile", newVal: "个人资料" },
          { index: 5927, oldVal: "Review", newVal: "审核" },
          { index: 8471, oldVal: "Review", newVal: "审核" },
          { index: 6011, oldVal: "1 file changed", newVal: "1 个文件已更改" },
          { index: 6012, oldVal: "{0} files changed", newVal: "{0} 个文件已更改" },
          { index: 5746, oldVal: "Changed 1 file", newVal: "已更改 1 个文件" },
          { index: 5747, oldVal: "Changed {0} files", newVal: "已更改 {0} 个文件" },
          { index: 5008, oldVal: "Open {0} User Settings", newVal: "打开 {0} 用户设置" },
          { index: 5015, oldVal: "Quick Settings Panel", newVal: "快速设置面板" },
          { index: 5018, oldVal: "Quick Settings Panel", newVal: "快速设置面板" },
          { index: 4978, oldVal: "Docs", newVal: "文档" },
          { index: 4979, oldVal: "Report Issue", newVal: "报告问题" },
          { index: 4980, oldVal: "Changelog", newVal: "更新日志" },
          { index: 6128, oldVal: "Limited", newVal: "受限" },
          { index: 6307, oldVal: "Limited", newVal: "受限" },
          { index: 6309, oldVal: "Limited", newVal: "受限" },
          { index: 5021, oldVal: "Reset to default shortcuts", newVal: "重置为默认快捷键" },
          { index: 955, oldVal: "Show more ({0})", newVal: "显示更多 ({0})" },
          { index: 5238, oldVal: "Show more...", newVal: "显示更多..." },
          { index: 5239, oldVal: "Show more...", newVal: "显示更多..." },
          { index: 9332, oldVal: "Accept Changes", newVal: "接受更改" },
          { index: 4, oldVal: "Error", newVal: "错误" },
          { index: 1185, oldVal: "Error", newVal: "错误" },
          { index: 1756, oldVal: "Error", newVal: "错误" },
          { index: 2196, oldVal: "Error", newVal: "错误" },
          { index: 2198, oldVal: "Error", newVal: "错误" },
          { index: 8630, oldVal: "Error", newVal: "错误" },
          { index: 9956, oldVal: "Error", newVal: "错误" },
          { index: 14084, oldVal: "Errored", newVal: "出错" },
          { index: 2201, oldVal: "Errors", newVal: "错误" },
          { index: 9784, oldVal: "1 Error", newVal: "1 个错误" },
          { index: 9785, oldVal: "{0} Errors", newVal: "{0} 个错误" },
          { index: 9721, oldVal: "Errors: {0}", newVal: "错误: {0}" },
          { index: 2099, oldVal: "Unknown Error", newVal: "未知错误" },
          { index: 12385, oldVal: "Task \"{0}\" finished in {1}.", newVal: "任务“{0}”在 {1} 内完成。" },
          { index: 12386, oldVal: "Task finished in {0}.", newVal: "任务在 {0} 内完成。" },
          { index: 5526, oldVal: "Finished in {0}.", newVal: "在 {0} 内完成。" },
          { index: 5528, oldVal: "Finished", newVal: "已完成" },
          { index: 5510, oldVal: "Failed", newVal: "已失败" },
          { index: 3870, oldVal: "Workspaces", newVal: "工作区" },
          { index: 3871, oldVal: "Open Folder", newVal: "打开文件夹" },
          { index: 3872, oldVal: "Clone Repository", newVal: "克隆仓库" },
          { index: 3873, oldVal: "Open Fig Workspace", newVal: "打开 Fig 工作区" },
          { index: 3874, oldVal: "Connect to Cloudtop", newVal: "连接至 Cloudtop" },
          { index: 3875, oldVal: "Generate Project", newVal: "生成项目" },
          { index: 3876, oldVal: "Open Folder", newVal: "打开文件夹" },
          { index: 3877, oldVal: "Show All Recent Folders {0}", newVal: "显示所有最近文件夹 {0}" },
          { index: 3878, oldVal: "Show More...", newVal: "显示更多..." },
          { index: 3879, oldVal: "Google Extensions", newVal: "Google 扩展" },
          { index: 3880, oldVal: "Download", newVal: "下载" },
          { index: 3882, oldVal: "Set up your AI Security Companion to start detecting vulnerabilities.", newVal: "设置您的 AI 安全助手以开始检测漏洞。" },
          { index: 3883, oldVal: "Get Started", newVal: "开始使用" },
          { index: 3887, oldVal: "Bring the full power of Google Data Cloud to your intelligent IDE.", newVal: "将 Google Data Cloud 的强大功能带入您的智能 IDE。" }
        ];

        let clpModifiedCount = 0;
        // 已知的原生中文语言包翻译，需要覆盖为我们的统一翻译
        const nativeChineseOverrides = {
          48: { '现在': '刚刚' },
          955: { '显示更多({0})': '显示更多 ({0})' },
          9721: { '错误: {0} 个': '错误: {0}' },
          3104: { '配置文件': '个人资料' },
          16330: { '配置文件': '个人资料' },
          5927: { '审阅': '审核' },
          8471: { '审阅': '审核' },
          6011: { '已更改 1 个文件': '1 个文件已更改' },
          6012: { '已更改 {0} 个文件': '{0} 个文件已更改' },
          12385: { '任务 "{0}" 已在 {1} 中完成。': '任务“{0}”在 {1} 内完成。' },
          12386: { '任务已在 {0} 中完成。': '任务在 {0} 内完成。' },
          5526: { '在 {0} 后完成。': '在 {0} 内完成。' },
          5524: { '正在运行...': '运行中...' }
        };
        clpMappings.forEach(mapping => {
          const currentVal = clpNlsData[mapping.index];
          if (currentVal === mapping.oldVal) {
            clpNlsData[mapping.index] = mapping.newVal;
            clpModifiedCount++;
          } else if (currentVal === mapping.newVal) {
            // Already our preferred translation, skip
          } else if (nativeChineseOverrides[mapping.index] && nativeChineseOverrides[mapping.index][currentVal]) {
            // Override native Chinese Language Pack translation with our preferred one
            clpNlsData[mapping.index] = nativeChineseOverrides[mapping.index][currentVal];
            clpModifiedCount++;
          } else {
            console.warn(`[WARN] CLP 缓存文件索引 ${mapping.index} 现为 "${currentVal}"，与预期 "${mapping.oldVal}" 不符，跳过。`);
          }
        });

        if (clpModifiedCount > 0) {
          console.log(`[INFO] CLP 缓存文件汉化完成，成功更新 ${clpModifiedCount} 个条目。`);
          console.log(`[SAFEGUARD] 正在执行 CLP 文件备份与安全写入...`);
          
          if (!fs.existsSync(clpNlsBackupPath)) {
            try {
              fs.copyFileSync(clpNlsPath, clpNlsBackupPath);
              console.log(`[OK] CLP 原始文件已成功备份至 "${clpNlsBackupPath}"。`);
            } catch (backupErr) {
              console.error(`[ERROR] 备份 CLP 文件失败: ${clpNlsPath},`, backupErr.message);
              continue;
            }
          }

          const clpContent = JSON.stringify(clpNlsData);
          const clpWriteResult = safeWriteWithValidation(clpNlsPath, clpContent, clpNlsBackupPath);
          if (!clpWriteResult.success) {
            console.error(`\x1b[31m[SAFEGUARD] ❌ CLP 缓存文件安全写入失败：${clpWriteResult.error}\x1b[0m`);
            autoRollbackOnFailure(config, clpWriteResult.error);
            return false;
          }
          console.log(`[SAFEGUARD] ✅ CLP 缓存文件安全写入成功！`);
        } else {
          console.log(`[INFO] CLP 缓存文件所有条目已处于汉化状态，无需更新。`);
        }
      } else {
        console.warn(`[WARN] CLP 缓存文件根对象不是 Array，跳过。`);
      }
    }
  }

  // 4e. 对 Antigravity 扩展主运行文件 extension.js 进行硬编码汉化替换
  const extensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');
  const extensionBackupPath = extensionPath + backupSuffix;

  if (fs.existsSync(extensionPath)) {
    console.log(`[INFO] 正在载入 Antigravity 扩展主运行文件 extension.js...`);
    
    // 自动备份
    if (!fs.existsSync(extensionBackupPath)) {
      try {
        fs.copyFileSync(extensionPath, extensionBackupPath);
        console.log(`[OK] Antigravity 扩展原始文件已成功备份至 "${extensionBackupPath}"。`);
      } catch (backupErr) {
        console.error(`[ERROR] 备份 Antigravity 扩展文件失败:`, backupErr.message);
        return false;
      }
    }

    let extensionContent;
    try {
      extensionContent = fs.readFileSync(extensionBackupPath, 'utf8');
    } catch (err) {
      console.error(`[ERROR] 读取 Antigravity 扩展备份文件失败:`, err.message);
      return false;
    }

    let extensionModified = false;
    let extReplacedCount = 0;

    console.log(`[INFO] 开始对 extension.js 应用汉化词典...`);
    for (let i = 0; i < sortedTranslations.length; i++) {
      const pair = sortedTranslations[i];
      const nextContent = extensionContent.replaceAll(pair.old, pair.new);
      if (nextContent !== extensionContent) {
        extensionContent = nextContent;
        extReplacedCount++;
        extensionModified = true;
      }
    }

    if (extensionModified) {
      console.log(`[INFO] extension.js 汉化替换完毕，成功应用 ${extReplacedCount} 组映射。`);
      console.log(`[SAFEGUARD] 正在执行 extension.js 安全写入...`);
      const extWriteResult = safeWriteWithValidation(extensionPath, extensionContent, extensionBackupPath);
      if (!extWriteResult.success) {
        console.error(`\x1b[31m[SAFEGUARD] ❌ extension.js 安全写入失败：${extWriteResult.error}\x1b[0m`);
        autoRollbackOnFailure(config, extWriteResult.error);
        return false;
      }
      console.log(`[SAFEGUARD] ✅ extension.js 安全写入成功！已通过全部预检。`);
    } else {
      console.log(`[INFO] extension.js 所有条目已处于汉化状态，无需更新。`);
    }
  } else {
    console.warn(`[WARN] 未找到 Antigravity 扩展文件: "${extensionPath}"，跳过扩展汉化。`);
  }

  // 4f. 对 out/main.js 应用汉化
  const mainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');
  const mainProcessBackupPath = mainProcessPath + backupSuffix;

  if (fs.existsSync(mainProcessPath)) {
    console.log(`[INFO] 正在载入 main.js...`);
    
    // 自动备份
    if (!fs.existsSync(mainProcessBackupPath)) {
      try {
        fs.copyFileSync(mainProcessPath, mainProcessBackupPath);
        console.log(`[OK] out/main.js 原始文件已成功备份至 "${mainProcessBackupPath}"。`);
      } catch (backupErr) {
        console.error(`[ERROR] 备份 out/main.js 失败:`, backupErr.message);
        return false;
      }
    }

    let mainProcessContent;
    try {
      mainProcessContent = fs.readFileSync(mainProcessBackupPath, 'utf8');
    } catch (err) {
      console.error(`[ERROR] 读取 out/main.js 备份文件失败:`, err.message);
      return false;
    }

    let mainProcessModified = false;
    let mainProcessReplacedCount = 0;

    console.log(`[INFO] 开始对 out/main.js 应用汉化词典...`);
    for (let i = 0; i < sortedTranslations.length; i++) {
      const pair = sortedTranslations[i];
      const nextContent = mainProcessContent.replaceAll(pair.old, pair.new);
      if (nextContent !== mainProcessContent) {
        mainProcessContent = nextContent;
        mainProcessReplacedCount++;
        mainProcessModified = true;
      }
    }

    if (mainProcessModified) {
      console.log(`[INFO] out/main.js 汉化替换完毕，成功应用 ${mainProcessReplacedCount} 组映射。`);
      console.log(`[SAFEGUARD] 正在执行 out/main.js 安全写入...`);
      const mainWriteResult = safeWriteWithValidation(mainProcessPath, mainProcessContent, mainProcessBackupPath);
      if (!mainWriteResult.success) {
        console.error(`\x1b[31m[SAFEGUARD] ❌ out/main.js 安全写入失败：${mainWriteResult.error}\x1b[0m`);
        autoRollbackOnFailure(config, mainWriteResult.error);
        return false;
      }
      console.log(`[SAFEGUARD] ✅ out/main.js 安全写入成功！已通过全部预检。`);
    } else {
      console.log(`[INFO] out/main.js 所有条目已处于汉化状态，无需更新。`);
    }
  } else {
    console.warn(`[WARN] 未找到 main.js 文件: "${mainProcessPath}"，跳过主进程汉化。`);
  }

  // 5. 自动更新 product.json 中的完整性哈希校验，防止报"安装已损坏"错误
  try {
    console.log(`[INFO] 正在为汉化和打补丁后的文件重新计算并更新完整性校验哈希...`);
    const productPath = path.join(path.dirname(targetFilePath), '..', '..', 'product.json');
    if (fs.existsSync(productPath)) {
      const productContent = fs.readFileSync(productPath, 'utf8');
      const productData = JSON.parse(productContent.replace(/\uFEFF/g, ''));
      if (productData.checksums) {
        // 更新 jetskiAgent/main.js
        const fileBuffer = fs.readFileSync(targetFilePath);
        const newHash = crypto.createHash('sha256').update(fileBuffer).digest('base64').replace(/=+$/, '');
        const oldHash = productData.checksums['jetskiAgent/main.js'];
        productData.checksums['jetskiAgent/main.js'] = newHash;
        console.log(`[OK] 完整性校验哈希已成功更新 (jetskiAgent/main.js)：\n     原哈希: ${oldHash}\n     新哈希: ${newHash}`);

        // 更新 vs/workbench/workbench.desktop.main.js
        if (fs.existsSync(workbenchPath)) {
          const wbBuffer = fs.readFileSync(workbenchPath);
          const newWbHash = crypto.createHash('sha256').update(wbBuffer).digest('base64').replace(/=+$/, '');
          const oldWbHash = productData.checksums['vs/workbench/workbench.desktop.main.js'];
          productData.checksums['vs/workbench/workbench.desktop.main.js'] = newWbHash;
          console.log(`[OK] 完整性校验哈希已成功更新 (vs/workbench/workbench.desktop.main.js)：\n     原哈希: ${oldWbHash}\n     新哈希: ${newWbHash}`);
        }

        fs.writeFileSync(productPath, JSON.stringify(productData, null, 2), 'utf8');
      } else {
        console.warn(`[WARN] 找不到 product.json 中的 checksums 属性，跳过哈希更新。`);
      }
    } else {
      console.warn(`[WARN] 找不到 product.json 文件，路径: "${productPath}"，跳过哈希更新。`);
    }

    console.log(`[OK] 汉化完成！`);
    return true;
  } catch (err) {
    console.error(`[ERROR] 更新校验哈希时发生错误:`, err.message);
    // 哈希更新失败不触发回滚（文件内容本身是正确的），但报告错误
    console.warn(`[WARN] 哈希更新失败但翻译文件本身完整，IDE 可能显示"安装已损坏"提示但功能不受影响。`);
    return true;
  }
}
