import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const backup = fs.readFileSync(backupPath, 'utf8');

// 1. Chrome 浏览器路径设置
console.log('=== 1. Chrome 路径设置 (backup) ===');
let idx1 = backup.indexOf('label:"Chrome Binary Path"');
if (idx1 !== -1) {
  console.log(backup.substring(idx1, idx1 + 300));
}

// 2. Browser User Profile Path
console.log('\n=== 2. User Profile 路径设置 (backup) ===');
let idx2 = backup.indexOf('BROWSER_USER_PROFILE_PATH');
if (idx2 !== -1) {
  console.log(backup.substring(idx2 - 20, idx2 + 400));
}

// 3. "file access policy" 上下文
console.log('\n=== 3. file access policy 上下文 (backup) ===');
let idx3 = backup.indexOf('file access policy');
if (idx3 !== -1) {
  console.log(backup.substring(idx3 - 200, idx3 + 100));
}

// 4. Terms of Service 上下文  
console.log('\n=== 4. Terms of Service 上下文 (backup) ===');
let idx4 = backup.indexOf('Terms of Service & Data Use');
if (idx4 !== -1) {
  console.log(backup.substring(idx4 - 100, idx4 + 800));
}

// 5. 另一个 Terms of Service
let idx5 = backup.indexOf('Terms of Service"]}');
if (idx5 !== -1) {
  console.log('\n=== 5. Terms of Service 链接 (backup) ===');
  console.log(backup.substring(idx5 - 200, idx5 + 200));
}

// 6. "Enabled" 在 UI 中的使用场景
console.log('\n=== 6. "Enabled" fallback 上下文 ===');
let idx6 = backup.indexOf('t.title||"Enabled"');
if (idx6 !== -1) {
  console.log(backup.substring(idx6 - 200, idx6 + 100));
}

// 7. Debug panel
console.log('\n=== 7. Debug panel 上下文 ===');
let idx7 = backup.indexOf('Debug (Enabled)');
if (idx7 !== -1) {
  console.log(backup.substring(idx7 - 100, idx7 + 200));
}
