import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- main.js function signature ---');
const idx1 = mainContent.indexOf('(!e.path)return""');
if (idx1 !== -1) {
  // 打印前面的 150 个字符，和后面的 50 个字符
  console.log(mainContent.substring(idx1 - 150, idx1 + 100));
}

console.log('\n--- workbench function signature ---');
const idx2 = wbContent.indexOf('(!t.path)return""');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2 - 150, idx2 + 100));
}
