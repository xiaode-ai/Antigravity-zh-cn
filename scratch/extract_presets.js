import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const backup = fs.readFileSync(backupPath, 'utf8');

// 获取安全预设完整定义 (One 对象)
console.log('=== 安全预设定义 (shortDescription + longDescription) ===');
let idx = backup.indexOf('shortDescription:"Requires manual review');
if (idx !== -1) {
  console.log(backup.substring(idx - 200, idx + 600));
}

// 搜索所有 shortDescription
console.log('\n\n=== 所有 shortDescription ===');
idx = 0;
let count = 0;
while ((idx = backup.indexOf('shortDescription:', idx)) !== -1) {
  count++;
  console.log(`\n[shortDescription #${count}] at ${idx}:`);
  console.log(backup.substring(idx - 80, idx + 300));
  console.log('---');
  idx += 'shortDescription:'.length;
  if (count >= 10) break;
}

// 搜索所有 displayName 附近的安全预设
console.log('\n\n=== 安全预设 displayName ===');
idx = 0;
count = 0;
while ((idx = backup.indexOf('displayName:', idx)) !== -1) {
  count++;
  if (count <= 10) {
    console.log(`\n[displayName #${count}] at ${idx}:`);
    console.log(backup.substring(idx - 30, idx + 200));
    console.log('---');
  }
  idx += 'displayName:'.length;
}
