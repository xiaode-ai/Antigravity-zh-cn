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

  // 1. 检查目标文件（main.js）是否存在
  if (!fs.existsSync(targetFilePath)) {
    console.error(`[ERROR] 找不到目标文件: "${targetFilePath}"，无法执行备份。`);
    return false;
  }

  // 2. 检查备份文件是否存在
  if (fs.existsSync(backupPath)) {
    // 最佳实践：如果备份文件已存在，说明已经有了最原始的出厂备份。
    // 为了防止在已汉化状态下重复备份导致原厂备份丢失，我们绝对不能覆盖！
    console.log(`[INFO] 备份文件 "${backupPath}" 已存在，跳过备份以保护原始文件。`);
    return true;
  }

  try {
    // 3. 执行物理备份
    fs.copyFileSync(targetFilePath, backupPath);
    console.log(`[OK] 备份成功！已将原始文件安全复制为: "${backupPath}"`);
    return true;
  } catch (err) {
    console.error(`[ERROR] 安全备份文件时发生错误:`, err.message);
    return false;
  }
}
