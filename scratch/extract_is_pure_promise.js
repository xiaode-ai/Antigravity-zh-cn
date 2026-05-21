import fs from 'fs';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';
const fileContent = fs.readFileSync(filePath, 'utf8');

const target = 'isPurePromise';
let idx = 0;
while (true) {
  idx = fileContent.indexOf(target, idx);
  if (idx === -1) break;
  console.log(`\nFound "${target}" at index ${idx}:`);
  console.log(fileContent.substring(idx - 150, idx + 250));
  idx += target.length;
}
