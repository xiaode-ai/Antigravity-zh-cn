import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const target = 'e?"Recording":"Processing"';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log(content.substring(idx - 150, idx + 250));
} else {
  console.log('Target not found');
}
