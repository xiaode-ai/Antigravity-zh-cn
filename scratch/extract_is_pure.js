import fs from 'fs';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';
const fileContent = fs.readFileSync(filePath, 'utf8');

const target = 'async _isPure(';
const index = fileContent.indexOf(target);

if (index !== -1) {
  // Find line number
  const linesBefore = fileContent.substring(0, index).split('\n');
  const lineNumber = linesBefore.length;
  console.log(`Found "${target}" at line ${lineNumber}, character index ${index}`);
  
  // Extract snippet
  const start = Math.max(0, index - 200);
  const end = Math.min(fileContent.length, index + 400);
  console.log('\n--- Code Snippet ---');
  console.log(fileContent.substring(start, end));
  console.log('--------------------\n');
} else {
  console.log(`Could not find "${target}" in the file.`);
}
