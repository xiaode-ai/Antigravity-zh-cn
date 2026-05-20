import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(mainPath, 'utf8');

const targets = [
  '自动打开修改的文件',
  '常规',
  '工作区',
  '权限'
];



for (const target of targets) {
  console.log(`=== Searching for: ${target} ===`);
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    count++;
    console.log(`[Occurrence ${count}] Index: ${idx}`);
    console.log(content.substring(idx - 100, idx + 200));
    console.log('-'.repeat(40));
    idx += target.length;
  }
}




