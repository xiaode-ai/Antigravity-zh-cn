import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const idx = 9688900;
console.log('=== 抓取插件列表第一处渲染代码 ===');
console.log(content.substring(idx - 100, idx + 2000));
