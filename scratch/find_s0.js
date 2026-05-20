import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

console.log('=== 全力搜寻 s0 组件的混淆定义 ===');

// 我们要在 main.js.bak 中搜 "s0=" 或者是 "var s0=" 或 "const s0="
// 但也有可能是混淆成 "s0=function" 或者是 "let s0="
let s0Idx = content.indexOf('var s0=');
if (s0Idx === -1) {
  s0Idx = content.indexOf('let s0=');
}
if (s0Idx === -1) {
  // 模糊查找，在 action:"read_file" 附近找 s0 相关的调用和定义
  const refIdx = content.indexOf('action:"read_file"');
  if (refIdx !== -1) {
    console.log('在 action:"read_file" 附近截取上下文以寻找 s0 来源:');
    console.log(content.substring(refIdx - 1000, refIdx + 500));
  }
} else {
  console.log(`找到 s0 定义在索引 ${s0Idx}:`);
  console.log(content.substring(s0Idx, s0Idx + 2000));
}
