import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

console.log('--- Searching for Ogt= in main.js.bak ---');
// 查找 Ogt 的声明，可以是 "Ogt=" 或 "const Ogt=" 或者是 "var Ogt="
let lastIdx = 0;
while (true) {
  const idx = mainContent.indexOf('Ogt=', lastIdx);
  if (idx === -1) break;
  console.log(`Match at ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 1000));
  console.log('-------------------------');
  lastIdx = idx + 1;
}
