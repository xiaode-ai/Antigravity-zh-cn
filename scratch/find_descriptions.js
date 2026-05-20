import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

console.log('=== 精细化截取 resolveOptionToDescription 描述映射逻辑 ===');
console.log(content.substring(9192800, 9194100));
