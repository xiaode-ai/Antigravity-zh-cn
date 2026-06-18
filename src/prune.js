import fs from 'fs';
import path from 'path';
import asar from 'asar';

function pruneDesktop(config, translationsPath) {
  const { asarPath, filesToTranslate = ['dist/main.js', 'dist/menu.js', 'dist/updater.js', 'dist/tray.js', 'dist/ipcHandlers.js', 'dist/loadingOverlay.js'] } = config;
  const backupPath = asarPath + '.bak';
  const sourceAsar = fs.existsSync(backupPath) ? backupPath : asarPath;

  console.log('[INFO] 正在启动 Antigravity 桌面端翻译剪裁引擎...');

  if (!fs.existsSync(sourceAsar)) {
    console.error('[CRITICAL] 找不到 asar 文件: "' + sourceAsar + '"');
    console.error('[TIP] 请先运行 "npm run translate" 进行初始汉化与自动备份。');
    return false;
  }

  // 从 asar 收集所有目标文件的原始内容
  const contents = [];
  for (const filePath of filesToTranslate) {
    try {
      const buf = asar.extractFile(sourceAsar, filePath);
      contents.push(buf.toString('utf8'));
    } catch (e) { /* skip missing */ }
  }
  const combinedContent = contents.join('\n');

  if (!fs.existsSync(translationsPath)) {
    console.error('[ERROR] 找不到词库文件: "' + translationsPath + '"');
    return false;
  }

  let translations = [];
  try {
    translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (err) {
    console.error('[CRITICAL] 词库 JSON 格式异常，无法解析:', err.message);
    return false;
  }

  if (!Array.isArray(translations)) {
    console.error('[ERROR] 词库格式不符合要求，必须为 [{old, new}] 数组形式。');
    return false;
  }

  console.log('[INFO] 当前词库条目总数: ' + translations.length);

  const activeTranslations = [];
  const prunedTranslations = [];

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    if (combinedContent.includes(pair.old)) {
      activeTranslations.push(pair);
    } else {
      prunedTranslations.push({ ...pair, index: i });
    }
  }

  if (prunedTranslations.length > 0) {
    console.log('\n[WARN] 发现 ' + prunedTranslations.length + ' 组失效的映射 (asarch 中未找到对应英文词条，可能已过期)，正在进行剪裁清理...');
    prunedTranslations.slice(0, 20).forEach((pair, index) => {
      const snippet = pair.old.substring(0, 60).replace(/\n/g, ' ');
      console.log('  ▶ [清理 ' + (index + 1) + '][原索引 ' + pair.index + '] "' + snippet + (pair.old.length > 60 ? '...' : '') + '"');
    });
    if (prunedTranslations.length > 20) {
      console.log('  ... 还有 ' + (prunedTranslations.length - 20) + ' 组已清理');
    }
  } else {
    console.log('\n[OK] 未发现过期失效的映射，无需清理。');
  }

  if (prunedTranslations.length > 0) {
    try {
      fs.writeFileSync(translationsPath, JSON.stringify(activeTranslations, null, 2), 'utf8');
      console.log('\n[OK] 剪裁清理成功！更新后的词库已写回: "' + translationsPath + '"');
      console.log('[STATUS] 清理前: ' + translations.length + ' 组 | 清理后: ' + activeTranslations.length + ' 组');
    } catch (err) {
      console.error('[ERROR] 写入更新后的词库文件失败:', err.message);
      return false;
    }
  }

  return true;
}

function pruneIDE(config, translationsPath) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const mainBackupPath = targetFilePath + backupSuffix;

  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const workbenchBackupPath = workbenchPath + backupSuffix;

  const extensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');

  const mainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');

  console.log('[INFO] 正在启动 Antigravity IDE 翻译剪裁引擎...');

  if (!fs.existsSync(mainBackupPath)) {
    console.error('[CRITICAL] 找不到 jetskiAgent/main.js 备份文件: "' + mainBackupPath + '"');
    console.error('[TIP] 请先运行 "npm run translate ide" 进行初始汉化与自动备份。');
    return false;
  }

  let mainContent = '';
  try { mainContent = fs.readFileSync(mainBackupPath, 'utf8'); } catch (e) { console.error('[ERROR] 读取 main.js 备份失败:', e.message); return false; }

  let wbContent = '';
  let hasWB = fs.existsSync(workbenchPath);
  if (hasWB) {
    const src = fs.existsSync(workbenchBackupPath) ? workbenchBackupPath : workbenchPath;
    try { wbContent = fs.readFileSync(src, 'utf8'); } catch (e) { /* ignore */ }
  }

  let extContent = '';
  if (fs.existsSync(extensionPath)) {
    try { extContent = fs.readFileSync(extensionPath, 'utf8'); } catch (e) { /* ignore */ }
  }

  let mpContent = '';
  if (fs.existsSync(mainProcessPath)) {
    const src = fs.existsSync(mainProcessPath + backupSuffix) ? mainProcessPath + backupSuffix : mainProcessPath;
    try { mpContent = fs.readFileSync(src, 'utf8'); } catch (e) { /* ignore */ }
  }

  if (!fs.existsSync(translationsPath)) {
    console.error('[ERROR] 找不到词库文件: "' + translationsPath + '"');
    return false;
  }

  let translations = [];
  try {
    translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (err) {
    console.error('[CRITICAL] 词库 JSON 格式异常，无法解析:', err.message);
    return false;
  }

  if (!Array.isArray(translations)) {
    console.error('[ERROR] 词库格式不符合要求，必须为 [{old, new}] 数组形式。');
    return false;
  }

  console.log('[INFO] 当前词库条目总数: ' + translations.length);

  const activeTranslations = [];
  const prunedTranslations = [];

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    const isMainActive = mainContent.includes(pair.old);
    const isWbActive = hasWB && wbContent.includes(pair.old);
    const isExtActive = extContent.includes(pair.old);
    const isMpActive = mpContent.includes(pair.old);

    if (isMainActive || isWbActive || isExtActive || isMpActive) {
      activeTranslations.push(pair);
    } else {
      prunedTranslations.push({ ...pair, index: i });
    }
  }

  if (prunedTranslations.length > 0) {
    console.log('\n[WARN] 发现 ' + prunedTranslations.length + ' 组失效的映射 (源码中未找到对应的英文词条，可能已过期)，正在进行剪裁清理...');
    prunedTranslations.slice(0, 20).forEach((pair, index) => {
      const snippet = pair.old.substring(0, 60).replace(/\n/g, ' ');
      console.log('  ▶ [清理 ' + (index + 1) + '][原索引 ' + pair.index + '] "' + snippet + (pair.old.length > 60 ? '...' : '') + '"');
    });
    if (prunedTranslations.length > 20) {
      console.log('  ... 还有 ' + (prunedTranslations.length - 20) + ' 组已清理');
    }
  } else {
    console.log('\n[OK] 未发现过期失效的映射，无需清理。');
  }

  if (prunedTranslations.length > 0) {
    try {
      fs.writeFileSync(translationsPath, JSON.stringify(activeTranslations, null, 2), 'utf8');
      console.log('\n[OK] 剪裁清理成功！更新后的词库已写回: "' + translationsPath + '"');
      console.log('[STATUS] 清理前: ' + translations.length + ' 组 | 清理后: ' + activeTranslations.length + ' 组');
    } catch (err) {
      console.error('[ERROR] 写入更新后的词库文件失败:', err.message);
      return false;
    }
  }

  return true;
}

export function prune(config, translationsPath, targetType = 'antigravity') {
  if (targetType === 'antigravity') {
    return pruneDesktop(config, translationsPath);
  } else if (targetType === 'ide') {
    return pruneIDE(config, translationsPath);
  } else {
    console.error('[CRITICAL] 未知目标类型: ' + targetType);
    return false;
  }
}
