import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import asar from 'asar';
import crypto from 'crypto';

async function safeSyntaxCheck(filePath, content) {
  try {
    const acorn = await import('acorn');
    acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'script' });
    return true;
  } catch (acornErr) {
    try {
      // 回退到 node --check：使用当前工作目录下的唯一临时文件，避免复用父级旧缓存或同名文件。
      const tmpDir = path.join(process.cwd(), '_zh-cn_check_tmp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      const safeName = filePath.replace(/[\\/:]/g, '_');
      const tmpFile = path.join(tmpDir, safeName);
      fs.writeFileSync(tmpFile, content, 'utf8');
      execSync('node --check "' + tmpFile + '"', { stdio: 'pipe' });
      fs.unlinkSync(tmpFile);
      return true;
    } catch (nodeErr) {
      console.error('[CRITICAL] ' + filePath + ' 语法校验失败！');
      console.error(nodeErr.message || (nodeErr.stderr && nodeErr.stderr.toString()));
      return false;
    }
  }
}

async function checkDesktop(config) {
  const { asarPath, filesToTranslate = ['dist/main.js', 'dist/menu.js', 'dist/updater.js', 'dist/tray.js', 'dist/ipcHandlers.js', 'dist/loadingOverlay.js'] } = config;

  console.log('[INFO] 正在启动 Antigravity 桌面端语法完整性校验器...');

  if (!fs.existsSync(asarPath)) {
    console.error('[ERROR] 找不到 asar 文件: "' + asarPath + '"');
    return false;
  }

  let passed = true;
  let checkedCount = 0;

  for (const filePath of filesToTranslate) {
    if (!filePath.endsWith('.js')) continue;
    try {
      const content = asar.extractFile(asarPath, filePath).toString('utf8');
      const ok = await safeSyntaxCheck(filePath, content);
      if (ok) checkedCount++;
      else passed = false;
    } catch (err) {
      console.error('[ERROR] 无法从 asar 读取待校验文件 "' + filePath + '": ' + err.message);
      passed = false;
    }
  }

  console.log('[OK] 共校验 ' + checkedCount + ' 个目标 JS 文件，' + (passed ? '全部通过语法检查。' : '存在语法错误。'));
  return passed;
}

function checkIDE(config) {
  const { targetFilePath } = config;

  console.log('[INFO] 正在启动 IDE 语法完整性校验器...');

  if (!fs.existsSync(targetFilePath)) {
    console.error('[ERROR] 找不到待校验的文件: "' + targetFilePath + '"');
    return false;
  }

  const workbenchPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
  const nlsPath = path.join(path.dirname(targetFilePath), '..', 'nls.messages.json');
  const mainProcessPath = path.join(path.dirname(targetFilePath), '..', 'main.js');

  try {
    execSync('node --check "' + targetFilePath + '"', { stdio: 'pipe' });
    console.log('[OK] jetskiAgent/main.js 语法校验通过！');

    if (fs.existsSync(workbenchPath)) {
      execSync('node --check "' + workbenchPath + '"', { stdio: 'pipe' });
      console.log('[OK] workbench.desktop.main.js 语法校验通过！');
    }

    if (fs.existsSync(mainProcessPath)) {
      execSync('node --check "' + mainProcessPath + '"', { stdio: 'pipe' });
      console.log('[OK] out/main.js 语法校验通过！');
    }

    if (fs.existsSync(nlsPath)) {
      try {
        JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
        console.log('[OK] nls.messages.json JSON 语法格式校验通过！');
      } catch (jsonErr) {
        console.error('[CRITICAL] nls.messages.json 损坏，不是有效的 JSON 格式:', jsonErr.message);
        return false;
      }
    }

    // product.json 哈希校验
    const appRoot = path.join(path.dirname(targetFilePath), '..', '..');
    const outRoot = path.join(appRoot, 'out');
    const productPath = path.join(appRoot, 'product.json');
    if (fs.existsSync(productPath)) {
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
          console.error('[CRITICAL] product.json 完整性哈希校验未通过，发现 ' + mismatches.length + ' 个不匹配文件：');
          mismatches.forEach(item => {
            console.error('  - ' + item.relativePath);
            console.error('    expected: ' + item.expected);
            console.error('    actual:   ' + item.actual);
          });
          return false;
        }

        console.log('[OK] product.json 完整性哈希校验通过！共验证 ' + Object.keys(checksums).length + ' 个文件。');
      } catch (err) {
        console.warn('[WARN] product.json 解析失败:', err.message);
      }
    }
    return true;
  } catch (err) {
    console.error('[CRITICAL] 语法校验未通过！文件可能存在语法缺陷：');
    if (err.stderr) console.error(err.stderr.toString());
    else console.error(err.message);
    return false;
  }
}

export async function check(config, targetType = 'antigravity') {
  if (targetType === 'antigravity') {
    return await checkDesktop(config);
  } else if (targetType === 'ide') {
    return checkIDE(config);
  } else {
    console.error('[CRITICAL] 未知目标类型: ' + targetType);
    return false;
  }
}
