import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = content.indexOf('_getSettingsItems(){const e=[');
  if (idx !== -1) {
    console.log(`Found _getSettingsItems at index ${idx}`);
    console.log(content.substring(idx, idx + 6000));
  } else {
    console.log('Not found precise _getSettingsItems start');
  }
} else {
  console.error('File not found:', filePath);
}
