import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf('"Agent"', idx);
    if (idx === -1) break;
    count++;
    console.log(`\nMatch #${count} at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 100).replace(/\r?\n/g, ' '));
    idx += 7;
  }
} else {
  console.error('File not found:', filePath);
}
