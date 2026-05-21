import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

let idx = 0;
while (true) {
  idx = content.indexOf('Allow in', idx);
  if (idx === -1) break;
  console.log(`Index: ${idx}`);
  console.log(content.substring(idx - 100, idx + 200));
  idx += 8;
}
