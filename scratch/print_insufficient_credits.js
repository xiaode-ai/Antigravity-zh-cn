import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const target = 'Insufficient AI Credits';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log(content.substring(idx - 300, idx + 400));
} else {
  console.log('Insufficient AI Credits not found');
}
