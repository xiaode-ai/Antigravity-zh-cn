import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const backup = fs.readFileSync(backupPath, 'utf8');

// 1. 设置摘要显示函数: 同时包含 "Always Proceed"/"Require Review"/"Proceed in Sandbox"/"Enabled"/"Disabled"
console.log('=== 1. 备份中的摘要显示函数 ===');
const summaryIdx = backup.indexOf('CASCADE_AUTO_EXECUTION_POLICY:return u===rl.EAGER?"Always Proceed"');
if (summaryIdx !== -1) {
  console.log(backup.substring(summaryIdx, summaryIdx + 250));
}

// 2. 浏览器JS选项数组 (带 vh.DISABLED label)
console.log('\n=== 2. 备份中的浏览器JS选项数组 ===');
const browserArrIdx = backup.indexOf('{value:vh.DISABLED,label:"Disabled"');
if (browserArrIdx !== -1) {
  console.log(backup.substring(browserArrIdx - 50, browserArrIdx + 400));
}

// 3. 再次检查浏览器 resolveOptionToString 和 resolveOptionToDescription 的完整定义
console.log('\n=== 3. 备份中浏览器 resolveOptionToString (从 vh.DISABLED 开始的 switch) ===');
const browserSwitchIdx = backup.indexOf('case vh.DISABLED:return"Disabled";case vh.ALWAYS_ASK:return"Request Review"');
if (browserSwitchIdx !== -1) {
  console.log(backup.substring(browserSwitchIdx - 80, browserSwitchIdx + 700));
}

// 4. 检查当前 main.js 中浏览器部分的实际状态
const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const main = fs.readFileSync(mainPath, 'utf8');

console.log('\n=== 4. 当前 main.js 中 vh.DISABLED 相关 ===');
let vhIdx = 0;
let vhCount = 0;
while ((vhIdx = main.indexOf('vh.DISABLED', vhIdx)) !== -1) {
  vhCount++;
  if (vhCount <= 5) {
    console.log(`\n[vh.DISABLED #${vhCount}] at ${vhIdx}:`);
    console.log(main.substring(vhIdx - 50, vhIdx + 200));
  }
  vhIdx += 'vh.DISABLED'.length;
}
console.log(`Total vh.DISABLED occurrences: ${vhCount}`);
