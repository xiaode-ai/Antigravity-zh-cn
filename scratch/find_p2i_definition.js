import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

let idx = 0;
let count = 0;
while (true) {
  idx = content.indexOf('P2i', idx);
  if (idx === -1) break;
  count++;
  const start = Math.max(0, idx - 80);
  const end = Math.min(content.length, idx + 80);
  console.log(`Match ${count} at ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  idx += 3;
}
