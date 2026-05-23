import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js"
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = 0;
  while (true) {
    idx = content.toLowerCase().indexOf("edited", idx);
    if (idx === -1) break;
    console.log(`[Found in ${path.basename(filePath)} at pos ${idx}]:`);
    console.log(content.substring(idx - 100, idx + 100).replace(/\n/g, ' '));
    idx += 6;
  }
}
