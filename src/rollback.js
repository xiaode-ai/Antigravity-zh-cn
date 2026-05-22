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

  const nlsPath = path.join(path.dirname(targetFilePath), '..', 'nls.messages.json');
  const nlsBackupPath = nlsPath + backupSuffix;

  const extensionPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js');
  const extensionBackupPath = extensionPath + backupSuffix;

  // 1. 检查是否存在任何备份文件
  if (!fs.existsSync(backupPath) && !fs.existsSync(workbenchBackupPath) && !fs.existsSync(nlsBackupPath) && !fs.existsSync(extensionBackupPath)) {
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

    // 4. 执行 rollback nls.messages.json
    if (fs.existsSync(nlsBackupPath)) {
      fs.copyFileSync(nlsBackupPath, nlsPath);
      console.log(`[OK] 原始 nls.messages.json 文件已覆盖还原。`);
    }

    // 4b. 执行 rollback extension.js
    if (fs.existsSync(extensionBackupPath)) {
      fs.copyFileSync(extensionBackupPath, extensionPath);
      fs.unlinkSync(extensionBackupPath);
      console.log(`[OK] 原始 extension.js 文件已覆盖还原并清理了备份文件。`);
    }

    // 5. 执行 CLP cached NLS files rollback
    const clpDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'Antigravity IDE', 'clp') : 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';
    if (fs.existsSync(clpDir)) {
      console.log(`[INFO] 正在扫描 CLP 缓存目录以回滚: "${clpDir}"...`);
      const clpBackupFiles = [];
      
      function walkClp(dir) {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat && stat.isDirectory()) {
            walkClp(fullPath);
          } else {
            if (file.toLowerCase() === 'nls.messages.json.bak') {
              clpBackupFiles.push(fullPath);
            }
          }
        });
      }
      
      try {
        walkClp(clpDir);
      } catch (walkErr) {
        console.warn(`[WARN] 扫描 CLP 目录进行回滚失败:`, walkErr.message);
      }

      console.log(`[INFO] 找到 ${clpBackupFiles.length} 个 CLP NLS 备份文件。`);
      clpBackupFiles.forEach(backupFile => {
        const originalFile = backupFile.substring(0, backupFile.length - backupSuffix.length);
        try {
          fs.copyFileSync(backupFile, originalFile);
          fs.unlinkSync(backupFile);
          console.log(`[OK] 已还原并删除备份: "${backupFile}" -> "${originalFile}"`);
        } catch (err) {
          console.error(`[ERROR] 还原 CLP 备份文件失败: ${backupFile},`, err.message);
        }
      });
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
