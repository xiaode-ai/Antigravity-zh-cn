import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const backup = fs.readFileSync(backupPath, 'utf8');
const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const main = fs.readFileSync(mainPath, 'utf8');

// 搜索 "Email" 在 Account 页面附近的代码
console.log('=== BACKUP: 搜索 Email 标签在 Account 区域 ===');
let emailIdx = backup.indexOf('Email\"');
while (emailIdx !== -1) {
  const ctx = backup.substring(emailIdx - 100, emailIdx + 200);
  if (ctx.includes('Account') || ctx.includes('account') || ctx.includes('email') || ctx.includes('user')) {
    console.log(`\n[backup] Email at ${emailIdx}:`);
    console.log(ctx);
    console.log('---');
  }
  emailIdx = backup.indexOf('Email\"', emailIdx + 1);
}

// 搜索 "电子邮箱" 在当前 main.js
console.log('\n=== MAIN: 搜索 "电子邮箱" ===');
let zhEmailIdx = main.indexOf('电子邮箱');
if (zhEmailIdx !== -1) {
  console.log(main.substring(zhEmailIdx - 300, zhEmailIdx + 300));
} else {
  console.log('"电子邮箱" 不存在于当前 main.js');
}

// 搜索 backup 中 Account 区域的完整结构
console.log('\n=== BACKUP: Account 页面 Email 区域 ===');
let accIdx = backup.indexOf('title:\"Account\"');
if (accIdx !== -1) {
  // 找到 Account 区域后搜索 email 相关代码
  let subContent = backup.substring(accIdx, accIdx + 5000);
  let eIdx = subContent.indexOf('email');
  if (eIdx === -1) eIdx = subContent.indexOf('Email');
  if (eIdx !== -1) {
    console.log(subContent.substring(Math.max(0, eIdx - 200), eIdx + 500));
  }
}

// 对比 BACKUP 和 MAIN 中 Account 部分的差异
console.log('\n=== MAIN: Account 页面 Email 区域 ===');
let mainAccIdx = main.indexOf('title:\"账户\"');
if (mainAccIdx === -1) mainAccIdx = main.indexOf('title:\"Account\"');
if (mainAccIdx !== -1) {
  let subContent = main.substring(mainAccIdx, mainAccIdx + 5000);
  let eIdx = subContent.indexOf('email');
  if (eIdx === -1) eIdx = subContent.indexOf('Email');
  if (eIdx === -1) eIdx = subContent.indexOf('电子邮箱');
  if (eIdx !== -1) {
    console.log(subContent.substring(Math.max(0, eIdx - 200), eIdx + 500));
  } else {
    console.log('在 Account 区域未找到 email 相关文本');
    // 显示 Account 区域前 2000 字
    console.log(subContent.substring(0, 2000));
  }
}
