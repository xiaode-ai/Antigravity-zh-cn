import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js"
];

const terms = [
  "Accept Changes",
  "Edited files",
  "edited file",
  "Error",
  "Searched"
];

function searchInFile(filePath, term) {
  if (!fs.existsSync(filePath)) {
    console.log(`Not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const termLower = term.toLowerCase();
  
  let index = 0;
  let count = 0;
  
  while (true) {
    index = content.toLowerCase().indexOf(termLower, index);
    if (index === -1) break;
    
    count++;
    // Extract context: 100 characters before and after
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + term.length + 100);
    const snippet = content.substring(start, end).replace(/\n/g, ' ');
    console.log(`[Found "${term}" in ${filePath} at pos ${index}]`);
    console.log(`Snippet: ... ${snippet} ...\n`);
    
    index += term.length;
    if (count > 20) {
      console.log(`... and more occurrences of "${term}" ...\n`);
      break;
    }
  }
}

for (const filePath of files) {
  for (const term of terms) {
    searchInFile(filePath, term);
  }
}
