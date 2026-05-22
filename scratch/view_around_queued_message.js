import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const idx = content.indexOf('Send Queued Message');
console.log('Index:', idx);
if (idx !== -1) {
  console.log(content.substring(idx - 250, idx + 250));
}
