import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- main.js Bye details ---');
// 查找包含 replace(/[_-]/g," ") 的部分
let lastIdx1 = 0;
while (true) {
  const idx = mainContent.indexOf('replace(/[_-]/g', lastIdx1);
  if (idx === -1) break;
  console.log(`Match in main.js at ${idx}:`);
  console.log(mainContent.substring(idx - 200, idx + 400));
  console.log('-------------------------');
  lastIdx1 = idx + 1;
}

console.log('--- workbench b8t details ---');
let lastIdx2 = 0;
while (true) {
  const idx = wbContent.indexOf('replace(/[_-]/g', lastIdx2);
  if (idx === -1) break;
  console.log(`Match in workbench at ${idx}:`);
  console.log(wbContent.substring(idx - 200, idx + 400));
  console.log('-------------------------');
  lastIdx2 = idx + 1;
}
