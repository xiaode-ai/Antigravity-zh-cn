import fs from 'fs';
import path from 'path';

const files = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

const targets = [
  'Editor-Specific Settings',
  'Move changes to main',
  'Good response',
  'Bad response',
  'Toggle Agent',
  'Quick Open'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n================== Searching in: ${path.basename(filePath)} ==================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  targets.forEach(target => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      count++;
      const start = Math.max(0, idx - 80);
      const end = Math.min(content.length, idx + target.length + 80);
      console.log(`\n  [MATCH #${count}] Target: "${target}" at index ${idx}`);
      console.log(`  Context: ${content.substring(start, end).trim().replace(/\s+/g, ' ')}`);
      idx += target.length;
    }
  });
});
