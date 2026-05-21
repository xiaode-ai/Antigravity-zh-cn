import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * 一键安全回滚原始出厂文件并恢复完整性校验哈希
 * @param {Object} config 配置参数 
 * @returns {boolean} 是否回滚成功
 */
export function rollback(config) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const backupPath = targetFilePath + backupSuffix;

  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const workbenchBackupPath = workbenchPath + backupSuffix;

  // 1. 检查是否存在任何备份文件
  if (!fs.existsSync(backupPath) && !fs.existsSync(workbenchBackupPath)) {
    console.warn(`[WARN] 找不到任何备份文件。可能还从未汉化过，无需回滚。`);
    return false;
  }

  try {
    const productPath = path.join(path.dirname(targetFilePath), '..', '..', 'product.json');
    let productData = null;
    if (fs.existsSync(productPath)) {
      const productContent = fs.readFileSync(productPath, 'utf8');
      productData = JSON.parse(productContent.replace(/\uFEFF/g, ''));
    }

    // 2. 执行 rollback main.js
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, targetFilePath);
      console.log(`[OK] 原始 jetskiAgent/main.js 文件已覆盖还原。`);
      
      if (productData && productData.checksums) {
        const fileBuffer = fs.readFileSync(backupPath);
        const originalHash = crypto.createHash('sha256').update(fileBuffer).digest('base64').replace(/=+$/, '');
        const oldHash = productData.checksums['jetskiAgent/main.js'];
        productData.checksums['jetskiAgent/main.js'] = originalHash;
        console.log(`[OK] jetskiAgent/main.js 完整性校验哈希已成功恢复：\n     原哈希: ${oldHash}\n     还原后: ${originalHash}`);
      }
    }

    // 3. 执行 rollback workbench.desktop.main.js
    if (fs.existsSync(workbenchBackupPath)) {
      fs.copyFileSync(workbenchBackupPath, workbenchPath);
      console.log(`[OK] 原始 workbench.desktop.main.js 文件已覆盖还原。`);
      
      if (productData && productData.checksums) {
        const fileBuffer = fs.readFileSync(workbenchBackupPath);
        const originalHash = crypto.createHash('sha256').update(fileBuffer).digest('base64').replace(/=+$/, '');
        const oldHash = productData.checksums['vs/workbench/workbench.desktop.main.js'];
        productData.checksums['vs/workbench/workbench.desktop.main.js'] = originalHash;
        console.log(`[OK] vs/workbench/workbench.desktop.main.js 完整性校验哈希已成功恢复：\n     原哈希: ${oldHash}\n     还原后: ${originalHash}`);
      }
    }

    // 保存 product.json
    if (productData) {
      fs.writeFileSync(productPath, JSON.stringify(productData, null, 2), 'utf8');
    }

    console.log(`[OK] 完美恢复！系统已安全回滚至原始出厂英文版。`);
    return true;
  } catch (err) {
    console.error(`[ERROR] 恢复备份文件或更新校验时发生错误:`, err.message);
    return false;
  }
}
