import fs from 'fs';
import path from 'path';

const extBackupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';
const content = fs.readFileSync(extBackupPath, 'utf8');

console.log("Searching for i.K_D.FAST:");
let index = 0;
while (true) {
  index = content.indexOf('i.K_D.FAST', index);
  if (index === -1) break;
  console.log(`Match at index ${index}:`);
  console.log(content.substring(index - 100, index + 100).replace(/\n/g, ' '));
  index += 10;
}

console.log("\nSearching for i.K_D.SLOW:");
index = 0;
while (true) {
  index = content.indexOf('i.K_D.SLOW', index);
  if (index === -1) break;
  console.log(`Match at index ${index}:`);
  console.log(content.substring(index - 100, index + 100).replace(/\n/g, ' '));
  index += 10;
}
