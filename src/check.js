import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import crypto from 'crypto';

/**
 * 校验最终生成的主文件的语法正确性
 * @param {Object} config 配置参数 
 * @returns {boolean} 是否校验通过
 */
export function check(config) {
  const { targetFilePath } = config;

  console.log(`[INFO] 正在启动语法完整性校验器...`);

  // 1. 检查文件是否存在
  if (!fs.existsSync(targetFilePath)) {
    console.error(`[ERROR] 找不到待校验的文件: "${targetFilePath}"`);
    return false;
  }

  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');

  try {
    // 2. 调用当前 Node 进程原生 --check 工具对文件进行极速抽象语法分析
    execSync(`node --check "${targetFilePath}"`, { stdio: 'pipe' });
    console.log(`[OK] jetskiAgent/main.js 语法校验通过！`);

    if (fs.existsSync(workbenchPath)) {
      execSync(`node --check "${workbenchPath}"`, { stdio: 'pipe' });
      console.log(`[OK] workbench.desktop.main.js 语法校验通过！`);
    }

    const checksumOk = checkProductChecksums(targetFilePath);
    if (!checksumOk) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[CRITICAL] 语法校验未通过！文件可能存在语法缺陷：`);
    if (err.stderr) {
      console.error(err.stderr.toString());
    } else {
      console.error(err.message);
    }
    return false;
  }
}

function checkProductChecksums(targetFilePath) {
  const appRoot = path.join(path.dirname(targetFilePath), '..', '..');
  const outRoot = path.join(appRoot, 'out');
  const productPath = path.join(appRoot, 'product.json');

  if (!fs.existsSync(productPath)) {
    console.warn(`[WARN] 找不到 product.json 文件，跳过完整性哈希校验: "${productPath}"`);
    return true;
  }

  try {
    const productData = JSON.parse(fs.readFileSync(productPath, 'utf8').replace(/\uFEFF/g, ''));
    const checksums = productData.checksums || {};
    const mismatches = [];

    for (const [relativePath, expected] of Object.entries(checksums)) {
      const filePath = path.join(outRoot, relativePath);
      if (!fs.existsSync(filePath)) {
        mismatches.push({ relativePath, expected, actual: '<missing>' });
        continue;
      }

      const actual = crypto.createHash('sha256')
        .update(fs.readFileSync(filePath))
        .digest('base64')
        .replace(/=+$/, '');

      if (actual !== expected) {
        mismatches.push({ relativePath, expected, actual });
      }
    }

    if (mismatches.length > 0) {
      console.error(`[CRITICAL] product.json 完整性哈希校验未通过，发现 ${mismatches.length} 个不匹配文件：`);
      mismatches.forEach(item => {
        console.error(`  - ${item.relativePath}`);
        console.error(`    expected: ${item.expected}`);
        console.error(`    actual:   ${item.actual}`);
      });
      return false;
    }

    console.log(`[OK] product.json 完整性哈希校验通过！共验证 ${Object.keys(checksums).length} 个文件。`);
    return true;
  } catch (err) {
    console.error(`[CRITICAL] product.json 无法解析或校验失败:`, err.message);
    return false;
  }
}
