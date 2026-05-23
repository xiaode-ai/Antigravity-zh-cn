import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js"
];

const terms = [
  "Accept Changes",
  "Edited files",
  "edited file",
  "Error",
  "Searched"
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`=== File: ${path.basename(filePath)} ===`);
  
  for (const term of terms) {
    let index = 0;
    let count = 0;
    while (true) {
      index = content.indexOf(term, index);
      if (index === -1) break;
      
      let isUiString = false;
      const start = Math.max(0, index - 80);
      const end = Math.min(content.length, index + term.length + 80);
      const snippet = content.substring(start, end).replace(/\n/g, ' ');
      
      if (term === "Error") {
        const lowerSnippet = snippet.toLowerCase();
        if (
          lowerSnippet.includes("children") ||
          lowerSnippet.includes("label") ||
          lowerSnippet.includes("title") ||
          lowerSnippet.includes("text") ||
          lowerSnippet.includes("status") ||
          lowerSnippet.includes("render")
        ) {
          isUiString = true;
        }
      } else {
        isUiString = true;
      }
      
      if (isUiString) {
        count++;
        console.log(`  [MATCH] "${term}" at Pos ${index}`);
        console.log(`  Snippet: ... ${snippet} ...\n`);
      }
      
      index += term.length;
    }
    console.log(`  --> Total UI/suspicious matches for "${term}": ${count}\n`);
  }
}
