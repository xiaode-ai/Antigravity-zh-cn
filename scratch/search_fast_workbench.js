import fs from 'fs';

const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

const idx = wbContent.indexOf('FAST,');
if (idx !== -1) {
  console.log('workbench FAST option:');
  console.log(wbContent.substring(idx - 200, idx + 500));
} else {
  console.log('FAST, not found');
}
