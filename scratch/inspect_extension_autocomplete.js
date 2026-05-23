import fs from 'fs';
import path from 'path';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';
const extBackupPath = extPath + '.bak';

const targetPath = fs.existsSync(extBackupPath) ? extBackupPath : extPath;
const content = fs.readFileSync(targetPath, 'utf8');

console.log("Searching in extension file:", targetPath);
const regex = /Autocomplete Speed/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 150, index + 150).replace(/\n/g, ' '));
}

// Let's print out the exact function or block around one of the matches
const matchIndex = content.indexOf('Autocomplete Speed:');
if (matchIndex !== -1) {
  console.log(`\nExact block at index ${matchIndex}:`);
  console.log(content.substring(matchIndex - 100, matchIndex + 200));
} else {
  console.log("Could not find exact 'Autocomplete Speed:'");
}
