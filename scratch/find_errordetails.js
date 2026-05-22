import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

console.log('Searching for "errorDetails" in main.js...');
let startIdx = 0;
while (true) {
  const idx = mainContent.indexOf('errorDetails', startIdx);
  if (idx === -1) break;
  console.log(`Found near index ${idx}:\n${mainContent.substring(idx - 100, idx + 150)}`);
  startIdx = idx + 1;
}
