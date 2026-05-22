import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

if (wbContent) {
  const start = 25903900;
  const end = 25904850;
  console.log(wbContent.substring(start, end));
} else {
  console.log('File not found');
}
