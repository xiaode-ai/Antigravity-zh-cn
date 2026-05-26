import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// 我们可以找 "Nh=" 这样的定义，但在混淆的代码中，Nh 可能是由 "let Nh=" 或者 "Nh=" 声明的
// 更有特异性的是，Nh 或者 VC 必然会解构 {fileUri: ...}

console.log('--- Searching in main.js ---');
// 查找包含 fileUri 的函数定义，比如 "({fileUri:" 或者是 "{fileUri:"
let lastIdx = 0;
while (true) {
  const idx = mainContent.indexOf('fileUri', lastIdx);
  if (idx === -1) break;
  // 打印周围200个字符
  console.log(`Match at ${idx}:`);
  console.log(mainContent.substring(idx - 100, idx + 100));
  console.log('-------------------------');
  lastIdx = idx + 1;
  if (lastIdx > idx + 20000) break; // 限制一下
}

console.log('--- Searching Nh= in main.js ---');
const idxNh = mainContent.indexOf('Nh=');
if (idxNh !== -1) {
  console.log(mainContent.substring(idxNh - 50, idxNh + 500));
}

console.log('--- Searching VC= in workbench ---');
const idxVC = wbContent.indexOf('VC=');
if (idxVC !== -1) {
  console.log(wbContent.substring(idxVC - 50, idxVC + 500));
}
