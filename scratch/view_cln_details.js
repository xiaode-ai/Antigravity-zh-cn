import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('=== Cln calls in main.js ===');
let startIdx = 0;
while (true) {
  const idx = mainContent.indexOf('Cln(', startIdx);
  if (idx === -1) break;
  console.log(`Found Cln( at index ${idx}:\n${mainContent.substring(idx - 100, idx + 150)}`);
  startIdx = idx + 1;
}

console.log('\n=== Uxo calls in workbench ===');
startIdx = 0;
while (true) {
  const idx = wbContent.indexOf('Uxo(', startIdx);
  if (idx === -1) break;
  console.log(`Found Uxo( at index ${idx}:\n${wbContent.substring(idx - 100, idx + 150)}`);
  startIdx = idx + 1;
}
