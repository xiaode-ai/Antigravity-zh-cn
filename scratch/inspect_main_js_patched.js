import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('--- main.js actual patched code ---');
let lastIdx1 = 0;
while (true) {
  const idx = mainContent.indexOf('replace(/[_-]/g', lastIdx1);
  if (idx === -1) break;
  console.log(mainContent.substring(idx - 100, idx + 400));
  console.log('-------------------------');
  lastIdx1 = idx + 1;
}

console.log('\n--- workbench actual patched code ---');
let lastIdx2 = 0;
while (true) {
  const idx = wbContent.indexOf('replace(/[_-]/g', lastIdx2);
  if (idx === -1) break;
  console.log(wbContent.substring(idx - 100, idx + 400));
  console.log('-------------------------');
  lastIdx2 = idx + 1;
}
