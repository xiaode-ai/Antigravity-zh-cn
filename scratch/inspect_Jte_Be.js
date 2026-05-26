import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- main.js Jte details ---');
// 查找 Jte 的定义。Jte 应该是 "Jte="
const idx1 = mainContent.indexOf('Jte=');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1 - 100, idx1 + 2500));
} else {
  // 也可以搜索 "function Jte"
  console.log('Jte= not found exactly, trying search Jte=');
}

console.log('\n--- workbench.desktop.main.js $Be details ---');
const idx2 = wbContent.indexOf('$Be=');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2 - 100, idx2 + 2500));
}
