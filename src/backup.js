import fs from 'fs';
import path from 'path';

/**
 * 安全备份主程序
 * @param {Object} config 配置参数 
 * @returns {boolean} 是否备份成功或已存在备份
 */
export function backup(config) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const backupPath = targetFilePath + backupSuffix;

  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const workbenchBackupPath = workbenchPath + backupSuffix;

  // 1. 备份 main.js
  let mainBackupSuccess = true;
  if (!fs.existsSync(targetFilePath)) {
    console.error(`[ERROR] 找不到目标文件: "${targetFilePath}"，无法执行备份。`);
    mainBackupSuccess = false;
  } else if (fs.existsSync(backupPath)) {
    console.log(`[INFO] 备份文件 "${backupPath}" 已存在，跳过备份以保护原始文件。`);
  } else {
    try {
      fs.copyFileSync(targetFilePath, backupPath);
      console.log(`[OK] 备份成功！已将原始文件安全复制为: "${backupPath}"`);
    } catch (err) {
      console.error(`[ERROR] 安全备份 main.js 时发生错误:`, err.message);
      mainBackupSuccess = false;
    }
  }

  // 2. 备份 workbench.desktop.main.js
  let workbenchBackupSuccess = true;
  if (!fs.existsSync(workbenchPath)) {
    console.warn(`[WARN] 找不到 workbench 文件: "${workbenchPath}"，跳过备份。`);
  } else if (fs.existsSync(workbenchBackupPath)) {
    console.log(`[INFO] 备份文件 "${workbenchBackupPath}" 已存在，跳过备份以保护原始文件。`);
  } else {
    try {
      fs.copyFileSync(workbenchPath, workbenchBackupPath);
      console.log(`[OK] 备份成功！已将原始 workbench 文件安全复制为: "${workbenchBackupPath}"`);
    } catch (err) {
      console.error(`[ERROR] 安全备份 workbench.desktop.main.js 时发生错误:`, err.message);
      workbenchBackupSuccess = false;
    }
  }

  return mainBackupSuccess && workbenchBackupSuccess;
}
