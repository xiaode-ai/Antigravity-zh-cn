import fs from 'fs';
import path from 'path';

const extBackupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';
const content = fs.readFileSync(extBackupPath, 'utf8');

console.log("Searching for 'Fast' in extension.js.bak:");
let regexFast = /\bFast\b/g;
let match;
while ((match = regexFast.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 100, index + 100).replace(/\n/g, ' '));
}

console.log("\nSearching for 'Slow' in extension.js.bak:");
let regexSlow = /\bSlow\b/g;
while ((match = regexSlow.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 100, index + 100).replace(/\n/g, ' '));
}
