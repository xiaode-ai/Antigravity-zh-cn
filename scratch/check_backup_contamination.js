import fs from 'fs';
import path from 'path';
import asar from 'asar';

const backupPath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\antigravity\\resources\\app.asar.bak";
if (!fs.existsSync(backupPath)) {
  console.log('未找到备份文件:', backupPath);
} else {
  try {
    const files = [
      'dist/main.js',
      'dist/menu.js',
      'dist/updater.js',
      'dist/tray.js',
      'dist/ipcHandlers.js',
      'dist/loadingOverlay.js',
      'dist/utils.js'
    ];
    for (const f of files) {
      try {
        const buf = asar.extractFile(backupPath, f);
        const content = buf.toString('utf8');
        const hasChinese = /[\u4e00-\u9fa5]/.test(content);
        console.log(`备份文件中的 ${f}: 含有中文? ${hasChinese}`);
        if (hasChinese) {
          // 找几个中文的例子打印出来
          const matches = content.match(/[\u4e00-\u9fa5]+/g);
          console.log(`  找到的中文片段样例 (前 10 个):`, matches.slice(0, 10));
        }
      } catch (e) {
        console.log(`文件 ${f} 提取或检查失败:`, e.message);
      }
    }
  } catch (err) {
    console.error('检查出错:', err.message);
  }
}
