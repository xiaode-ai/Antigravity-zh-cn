import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const backup = fs.readFileSync(backupPath, 'utf8');

// 获取完整的 Telemetry/consent 区域
console.log('=== 同意对话框完整文本 (backup) ===');
let idx = backup.indexOf('does not collect any of your prompts');
if (idx !== -1) {
  console.log(backup.substring(idx - 200, idx + 600));
}

// 获取 "Yes, I agree to help improve" 完整文本
console.log('\n\n=== 同意选项完整文本 (backup) ===');
idx = backup.indexOf('Yes, I agree to help improve');
if (idx !== -1) {
  console.log(backup.substring(idx - 100, idx + 600));
}

// 获取 "I understand I can choose" 完整文本
console.log('\n\n=== 退出选项完整文本 (backup) ===');
idx = backup.indexOf('I understand I can choose');
if (idx !== -1) {
  console.log(backup.substring(idx - 200, idx + 300));
}

// 获取 accounts / your plan 区域
console.log('\n\n=== accounts/your plan 区域 (backup) ===');
idx = backup.indexOf('accounts\":\"your plan\"');
if (idx !== -1) {
  console.log(backup.substring(idx - 100, idx + 400));
}

// Security Notice 的后续文本
console.log('\n\n=== Security Notice 后续 (backup) ===');
idx = backup.indexOf('Security Notice & Data Use');
if (idx !== -1) {
  console.log(backup.substring(idx - 50, idx + 1200));
}
