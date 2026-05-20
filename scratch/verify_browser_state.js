import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const main = fs.readFileSync(mainPath, 'utf8');

// 精确查找浏览器 resolveOptionToDescription 在当前 main.js 中的内容
const marker = 'resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return"';
let idx = main.indexOf(marker);
while (idx !== -1) {
  console.log('\n=== 浏览器 resolveOptionToDescription 位置:', idx, '===');
  console.log(main.substring(idx, idx + 500));
  idx = main.indexOf(marker, idx + marker.length);
}

// 确认 Prompt for approval 是否还在
console.log('\n=== Prompt for approval 搜索 ===');
const pfa = main.indexOf('Prompt for approval');
console.log('位置:', pfa);
if (pfa !== -1) {
  console.log(main.substring(pfa - 100, pfa + 200));
}

// 确认 "在运行浏览器脚本" 的搜索
const zhBrowser = main.indexOf('在运行浏览器脚本');
console.log('\n=== "在运行浏览器脚本" 搜索 ===');
console.log('位置:', zhBrowser);
if (zhBrowser !== -1) {
  console.log(main.substring(zhBrowser - 100, zhBrowser + 200));
}

// 确认 "阻止所有浏览器" 
const zhBlock = main.indexOf('阻止所有浏览器');
console.log('\n=== "阻止所有浏览器" 搜索 ===');
console.log('位置:', zhBlock);
if (zhBlock !== -1) {
  console.log(main.substring(zhBlock - 100, zhBlock + 200));
}

// 搜索 "Allow full browser"
const afb = main.indexOf('Allow full browser');
console.log('\n=== "Allow full browser" 搜索 ===');
console.log('位置:', afb);

// 搜索 "Block all browser"
const bab = main.indexOf('Block all browser');
console.log('\n=== "Block all browser" 搜索 ===');
console.log('位置:', bab);
