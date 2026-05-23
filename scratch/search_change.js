import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupSuffix = '.bak';

const mainBackupPath = targetFilePath + backupSuffix;

if (fs.existsSync(mainBackupPath)) {
  const content = fs.readFileSync(mainBackupPath, 'utf8');
  let index = -1;
  while ((index = content.indexOf('changed', index + 1)) !== -1) {
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 80);
    const snippet = content.substring(start, end).replace(/\n/g, ' ');
    if (snippet.includes('change') || snippet.includes('file')) {
      console.log(`Found at Index: ${index}`);
      console.log(`  Context: ... ${snippet} ...`);
    }
  }
}
