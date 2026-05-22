import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

if (fs.existsSync(mainPath)) {
  const content = fs.readFileSync(mainPath, 'utf8');
  const pattern = 'return n>0?`Refreshes in ${n} day${n>1?"s":""}, ${a} hour${a>1?"s":""}`:a>0?`Refreshes in ${a} hour${a>1?"s":""}, ${i} minute${i>1?"s":""}`:`Refreshes in ${i} minute${i>1?"s":""}`';
  console.log('Match found:', content.includes(pattern));
} else {
  console.log('main.js.bak not found');
}
