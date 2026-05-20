import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

console.log('=== 验证编译后的 main.js 中描述小字的汉化现状 ===');

const targets = [
  '智能体在执行终端命令前从不请求确认',
  '如果在沙箱内运行，终端命令会自动执行'
];

targets.forEach((t, i) => {
  let idx = content.indexOf(t);
  if (idx !== -1) {
    console.log(`[OK] 目标 #${i+1} 已成功汉化为: "${t}"`);
    console.log(`     上下文: ${content.substring(idx - 50, idx + t.length + 100)}`);
  } else {
    console.log(`[FAILED] 找不到目标 #${i+1} "${t}"`);
  }
});
