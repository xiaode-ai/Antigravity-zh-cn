import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

if (wbContent) {
  console.log(`=== Rules in workbench.desktop.main.js.bak ===`);
  const keywords = ['children:"Rules"', 'text:"Rules"', 'label:"Rules"', 'Rules'];
  keywords.forEach(keyword => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = wbContent.indexOf(keyword, idx);
      if (idx === -1) break;
      const context = wbContent.substring(idx - 100, idx + 100);
      if (context.includes('children:"') || context.includes('text:"') || context.includes('label:"')) {
        count++;
        console.log(`  Match ${count} at ${idx}: ${context.replace(/\r?\n/g, ' ')}`);
      }
      idx += keyword.length;
    }
  });
} else {
  console.log('File not found');
}
