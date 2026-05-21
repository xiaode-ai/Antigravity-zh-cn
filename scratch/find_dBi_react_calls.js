import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

// Search for dBi starting from index 9000000
let idx = 9000000;
while (true) {
  idx = content.indexOf('dBi', idx);
  if (idx === -1) break;
  console.log(`\nFound dBi at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 100));
  idx += 3;
}
