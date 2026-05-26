import fs from 'fs';
import path from 'path';

const file = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(file, 'utf8');

// 查找 "Plugin: " 的位置
const target = 'Path copied!';
const index = content.indexOf(target);

if (index !== -1) {
  console.log('Found Path copied! at index:', index);
  // 截取前面 4000 个字符以获取整个组件
  const start = Math.max(0, index - 4000);
  const end = Math.min(content.length, index + 500);
  const snippet = content.substring(start, end);
  console.log('\n--- SNIPPET ---');
  console.log(snippet);
  console.log('--- END SNIPPET ---\n');
} else {
  console.log('Target not found!');
}
