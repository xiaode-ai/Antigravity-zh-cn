import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = content.indexOf('ZJd={[LYe.Settings]');
  if (idx !== -1) {
    console.log(`Found [LYe.Settings] at index ${idx}`);
    console.log('Context (50 chars before and 200 chars after):');
    console.log(content.substring(idx - 50, idx + 200));
  } else {
    console.log('Not found ZJd={[LYe.Settings]');
  }
} else {
  console.error('File not found:', filePath);
}
