import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = 9197420;
  console.log(`Context in jetskiAgent/main.js.bak around index ${idx}:`);
  console.log(content.substring(idx - 3500, idx + 2500).replace(/\r?\n/g, ' '));
} else {
  console.error('File not found');
}
