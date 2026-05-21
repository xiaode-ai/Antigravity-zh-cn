import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const term = 'Editor-Specific Settings';
const index = content.indexOf(term);
if (index !== -1) {
  console.log(`Found "${term}" at index ${index}`);
  const start = Math.max(0, index - 100);
  const end = Math.min(content.length, index + term.length + 100);
  console.log(`Context: ${content.substring(start, end)}`);
} else {
  console.log(`"${term}" NOT found`);
}
