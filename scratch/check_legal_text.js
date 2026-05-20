import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const main = fs.readFileSync(mainPath, 'utf8');

// 检查 Terms of Service 链接上下文
console.log('=== 当前 main.js 中 "Terms of Service" 残留 ===');
let idx = main.indexOf('Terms of Service');
if (idx !== -1) {
  console.log(main.substring(idx - 200, idx + 200));
}

// 检查 "Google Privacy Policy" 
console.log('\n=== Google Privacy Policy ===');
idx = main.indexOf('Google Privacy Policy');
if (idx !== -1) {
  console.log(main.substring(idx - 100, idx + 200));
}

// 检查 "and" 连接词
console.log('\n=== 连接词 "and" 上下文 ===');
idx = main.indexOf('\" \",\"and\",\" \"');
if (idx !== -1) {
  console.log(main.substring(idx - 200, idx + 200));
}

// 检查 "accounts" 和 "your plan" 
console.log('\n=== accounts / your plan 上下文 ===');
idx = main.indexOf('accounts');
if (idx !== -1) {
  // 只找设置相关的
  let foundRelevant = false;
  while (idx !== -1) {
    const ctx = main.substring(idx - 50, idx + 50);
    if (ctx.includes('plan')) {
      console.log(`at ${idx}: ${ctx}`);
      foundRelevant = true;
    }
    idx = main.indexOf('accounts', idx + 1);
    if (foundRelevant) break;
  }
}

// 检查 telemetry 相关文本
console.log('\n=== Telemetry / product analytics ===');
const patterns = [
  'does not collect any of your prompts',
  'product analytics',
  'help improve',
  'allowing Google to collect',
  'I understand I can choose',
];
for (const pat of patterns) {
  idx = main.indexOf(pat);
  console.log(`"${pat}": ${idx === -1 ? '✅ 已清除' : `❌ 残留 at ${idx}`}`);
  if (idx !== -1) {
    console.log(main.substring(idx - 50, idx + 150));
  }
}
