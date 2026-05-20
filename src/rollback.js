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

  // 1. 检查是否存在备份文件
  if (!fs.existsSync(backupPath)) {
    console.warn(`[WARN] 找不到备份文件: "${backupPath}"。可能还从未汉化过，无需回滚。`);
    return false;
  }

  try {
    // 2. 执行回滚覆盖
    fs.copyFileSync(backupPath, targetFilePath);
    console.log(`[OK] 原始文件已覆盖还原。`);

    // 3. 自动将 product.json 中的完整性哈希校验恢复为原始文件的哈希
    console.log(`[INFO] 正在将完整性校验哈希还原为出厂哈希...`);
    const productPath = path.join(path.dirname(targetFilePath), '..', '..', 'product.json');
    if (fs.existsSync(productPath)) {
      const fileBuffer = fs.readFileSync(backupPath);
      const originalHash = crypto.createHash('sha256').update(fileBuffer).digest('base64').replace(/=+$/, '');
      
      const productContent = fs.readFileSync(productPath, 'utf8');
      const productData = JSON.parse(productContent.replace(/\uFEFF/g, ''));
      if (productData.checksums) {
        const oldHash = productData.checksums['jetskiAgent/main.js'];
        productData.checksums['jetskiAgent/main.js'] = originalHash;
        fs.writeFileSync(productPath, JSON.stringify(productData, null, 2), 'utf8');
        console.log(`[OK] 完整性校验哈希已成功恢复：\n     原哈希: ${oldHash}\n     还原后: ${originalHash}`);
      } else {
        console.warn(`[WARN] 找不到 product.json 中的 checksums 属性，跳过哈希还原。`);
      }
    } else {
      console.warn(`[WARN] 找不到 product.json 文件，路径: "${productPath}"，跳过哈希还原。`);
    }

    console.log(`[OK] 完美恢复！系统已安全回滚至原始出厂英文版。`);
    return true;
  } catch (err) {
    console.error(`[ERROR] 恢复备份文件或更新校验时发生错误:`, err.message);
    return false;
  }
}
