import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const target = 'function nZi(e,t){';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log(content.substring(idx, idx + 1000));
} else {
  console.log('nZi not found');
}
