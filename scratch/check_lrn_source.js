import fs from 'fs';
import path from 'path';

const file = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(file, 'utf8');

const target = 'lRn=({isGlobal:';
const index = content.indexOf(target);

if (index !== -1) {
  // 截取 300 个字符
  console.log(content.substring(index, index + 300));
} else {
  console.log('Not found!');
}
