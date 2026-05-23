import fs from 'fs';
import path from 'path';

/**
 * 剪裁清理已失效/过期的翻译条目
 * 
 * 🛡️ 安全加固版：
 *   - 支持 jetskiAgent/main.js 与 vs/workbench/workbench.desktop.main.js 的双端备份检索
 *   - 避免误删仅在 workbench 运行中生效的活跃翻译条目
 *   - 清理后自动回写规范化后的 JSON 并以 2 空格格式化美化
 * 
 * @param {Object} config 配置参数 
 * @param {string} translationsPath 词库 translations.json 绝对路径 
 * @returns {boolean} 是否成功执行剪裁
 */
export function prune(config, translationsPath) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const mainBackupPath = targetFilePath + backupSuffix;

  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const workbenchBackupPath = workbenchPath + backupSuffix;

  const extensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');
  const extensionBackupPath = extensionPath + backupSuffix;

  const mainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');
  const mainProcessBackupPath = mainProcessPath + backupSuffix;

  console.log(`[INFO] 正在启动翻译剪裁引擎...`);

  // 1. 验证 main.js 备份文件是否存在
  if (!fs.existsSync(mainBackupPath)) {
    console.error(`\x1b[31m[CRITICAL] 找不到 jetskiAgent/main.js 备份文件: "${mainBackupPath}"\x1b[0m`);
    console.error(`[TIP] 请先运行 "npm run translate" 进行初始汉化与自动备份，或检查 config.json 中的 targetFilePath 设置是否正确。`);
    return false;
  }

  // 2. 验证 workbench.desktop.main.js 备份文件是否存在 (如果宿主 workbench 文件存在)
  let hasWorkbenchBackup = false;
  if (fs.existsSync(workbenchPath)) {
    if (!fs.existsSync(workbenchBackupPath)) {
      console.error(`\x1b[31m[CRITICAL] 检测到 workbench 文件存在，但其备份文件不存在: "${workbenchBackupPath}"\x1b[0m`);
      console.error(`[TIP] 请先运行 "npm run translate" 以保证 workbench 备份文件正确生成后再执行剪裁，避免 active 条目被误删。`);
      return false;
    }
    hasWorkbenchBackup = true;
  }

  // 3. 读取备份文件内容
  let mainContent = '';
  try {
    mainContent = fs.readFileSync(mainBackupPath, 'utf8');
  } catch (err) {
    console.error(`[ERROR] 读取 main.js 备份文件失败:`, err.message);
    return false;
  }

  let wbContent = '';
  if (hasWorkbenchBackup) {
    try {
      wbContent = fs.readFileSync(workbenchBackupPath, 'utf8');
    } catch (err) {
      console.error(`[ERROR] 读取 workbench 备份文件失败:`, err.message);
      return false;
    }
  }

  let extContent = '';
  let hasExtensionBackup = false;
  if (fs.existsSync(extensionPath)) {
    const backupToRead = fs.existsSync(extensionBackupPath) ? extensionBackupPath : extensionPath;
    try {
      extContent = fs.readFileSync(backupToRead, 'utf8');
      hasExtensionBackup = true;
    } catch (err) {
      console.warn(`[WARN] 读取 extension 备份文件失败:`, err.message);
    }
  }

  let mainProcContent = '';
  let hasMainProcBackup = false;
  if (fs.existsSync(mainProcessPath)) {
    const backupToRead = fs.existsSync(mainProcessBackupPath) ? mainProcessBackupPath : mainProcessPath;
    try {
      mainProcContent = fs.readFileSync(backupToRead, 'utf8');
      hasMainProcBackup = true;
    } catch (err) {
      console.warn(`[WARN] 读取 out/main.js 备份文件失败:`, err.message);
    }
  }

  // 4. 读取并解析 translations.json
  if (!fs.existsSync(translationsPath)) {
    console.error(`[ERROR] 找不到词库文件: "${translationsPath}"`);
    return false;
  }

  let translations = [];
  try {
    translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (err) {
    console.error(`[CRITICAL] 词库 JSON 格式异常，无法解析:`, err.message);
    return false;
  }

  if (!Array.isArray(translations)) {
    console.error(`[ERROR] 词库格式不符合要求，必须为[{old, new}]数组形式。`);
    return false;
  }

  console.log(`[INFO] 当前词库条目总数: ${translations.length}`);

  const activeTranslations = [];
  const prunedTranslations = [];

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    const isMainActive = mainContent.includes(pair.old);
    const isWbActive = hasWorkbenchBackup && wbContent.includes(pair.old);
    const isExtActive = hasExtensionBackup && extContent.includes(pair.old);
    const isMainProcActive = hasMainProcBackup && mainProcContent.includes(pair.old);

    if (isMainActive || isWbActive || isExtActive || isMainProcActive) {
      activeTranslations.push(pair);
    } else {
      prunedTranslations.push({ ...pair, index: i });
    }
  }

  // 5. 打印被剪裁的已失效条目
  if (prunedTranslations.length > 0) {
    console.log(`\n\x1b[33m[WARN] 发现 ${prunedTranslations.length} 组失效的映射 (源码中未找到对应的英文词条，可能已过期)，正在进行剪裁清理...\x1b[0m`);
    prunedTranslations.forEach((pair, index) => {
      const snippet = pair.old.substring(0, 60).replace(/\n/g, ' ');
      console.log(`  ▶ [清理 ${index + 1}][原索引 ${pair.index}] "${snippet}${pair.old.length > 60 ? '...' : ''}"`);
    });
  } else {
    console.log(`\n\x1b[32m[OK] 未发现过期失效的映射，无需清理。\x1b[0m`);
  }

  // 6. 写回 translations.json (保持 2 空格缩进)
  if (prunedTranslations.length > 0) {
    try {
      fs.writeFileSync(translationsPath, JSON.stringify(activeTranslations, null, 2), 'utf8');
      console.log(`\n[OK] 剪裁清理成功！更新后的词库已写回: "${translationsPath}"`);
      console.log(`[STATUS] 清理前: ${translations.length} 组 | 清理后: ${activeTranslations.length} 组`);
    } catch (err) {
      console.error(`[ERROR] 写入更新后的词库文件失败:`, err.message);
      return false;
    }
  }

  return true;
}
