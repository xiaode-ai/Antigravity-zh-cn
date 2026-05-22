import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';
const mainPath = path.join(targetDir, 'out', 'jetskiAgent', 'main.js');

if (fs.existsSync(mainPath)) {
  const content = fs.readFileSync(mainPath, 'utf8');
  const expected = 'return n>0?`在 ${n} 天 ${a} 小时后重置`:a>0?`在 ${a} 小时 ${i} 分钟后重置`:`在 ${i} 分钟后重置`';
  console.log('Match target after translation (with "重置"):', content.includes(expected));
} else {
  console.log('main.js not found');
}
