import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- main.js Nh details ---');
const idx1 = mainContent.indexOf('Nh=({');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1, idx1 + 1500));
}

console.log('\n--- workbench.desktop.main.js VC details ---');
const idx2 = wbContent.indexOf('VC=({');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2, idx2 + 1500));
}
