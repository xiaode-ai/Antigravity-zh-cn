import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const main = fs.readFileSync(mainPath, 'utf8');

// 检查当前 main.js 中 Terms of Service 区域
console.log('=== Terms of Service 在当前 main.js 中的状态 ===');
let idx = main.indexOf('Terms of Service');
while (idx !== -1) {
  console.log(`\n位置 ${idx}:`);
  console.log(main.substring(idx - 100, idx + 200));
  console.log('---');
  idx = main.indexOf('Terms of Service', idx + 1);
}

// 检查 Security Notice 区域
console.log('\n=== Security Notice 在当前 main.js 中的状态 ===');
idx = main.indexOf('Security Notice');
if (idx !== -1) {
  console.log(main.substring(idx - 100, idx + 800));
}

// 检查 Browser User Profile Path
console.log('\n=== Browser 设置在当前 main.js 中 ===');
idx = main.indexOf('Browser User Profile Path');
if (idx !== -1) {
  console.log(main.substring(idx - 50, idx + 300));
} else {
  idx = main.indexOf('浏览器用户配置文件');
  if (idx !== -1) {
    console.log('已翻译:', main.substring(idx - 50, idx + 300));
  } else {
    console.log('未找到 Browser User Profile Path');
    // Search for browserUserProfilePath config  
    idx = main.indexOf('BROWSER_USER_PROFILE_PATH,{');
    if (idx !== -1) {
      console.log(main.substring(idx - 20, idx + 350));
    }
  }
}

// 检查 Security preset 长描述区域
console.log('\n=== Security preset description 上下文 ===');
idx = main.indexOf('Choose a predefined security preset');
if (idx !== -1) {
  console.log('仍为英文:', main.substring(idx - 50, idx + 200));
} else {
  idx = main.indexOf('为智能体选择');
  if (idx !== -1) {
    console.log('已翻译:', main.substring(idx - 50, idx + 200));
  } else {
    console.log('未找到预设描述');
  }
}

// 检查 longDescription
console.log('\n=== longDescription 搜索 ===');
idx = main.indexOf('longDescription');
let count = 0;
while (idx !== -1 && count < 3) {
  count++;
  console.log(`\nlongDescription #${count} at ${idx}:`);
  console.log(main.substring(idx - 100, idx + 200));
  idx = main.indexOf('longDescription', idx + 1);
}
