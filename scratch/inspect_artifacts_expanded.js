import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- main.js ODi expandedContent ---');
const idx1 = mainContent.indexOf('ODi=()=>');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1, idx1 + 2500));
}

console.log('\n--- workbench.desktop.main.js UEu expandedContent ---');
const idx2 = wbContent.indexOf('UEu=()=>');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2, idx2 + 2500));
}
