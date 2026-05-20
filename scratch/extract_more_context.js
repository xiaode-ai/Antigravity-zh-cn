import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const backup = fs.readFileSync(backupPath, 'utf8');

// 获取 Browser 页面的全部设置定义
console.log('=== Browser User Profile Path 定义 ===');
let idx = backup.indexOf('Browser User Profile Path');
if (idx !== -1) {
  console.log(backup.substring(idx - 50, idx + 350));
}

// 获取 Browser CDP Port
console.log('\n=== Browser CDP Port 定义 ===');
idx = backup.indexOf('BROWSER_CDP_PORT,{');
if (idx !== -1) {
  console.log(backup.substring(idx - 20, idx + 350));
}

// 获取 Browser Allowlist
console.log('\n=== Browser Allowlist 定义 ===');
idx = backup.indexOf('BROWSER_ALLOWLIST,{');
if (idx !== -1) {
  console.log(backup.substring(idx - 20, idx + 350));
}

// 获取 "Manually customize individual settings." 上下文
console.log('\n=== Security preset 小字 上下文 ===');
idx = backup.indexOf('Manually customize individual settings.');
if (idx !== -1) {
  console.log(backup.substring(idx - 200, idx + 200));
}

// 搜索 Terms of Service section 的更完整上下文 (包括 "and" 和 "Terms and Privacy")
console.log('\n=== Terms of Service 完整区域 ===');
idx = backup.indexOf('Terms of Service & Data Use');
if (idx !== -1) {
  console.log(backup.substring(idx - 100, idx + 1500));
}
