import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js"
];

const patterns = [
  { name: "Accept Changes", regex: /Accept Changes/gi },
  { name: "Edited files", regex: /Edited files/gi },
  { name: "View X edited files", regex: /View \d+ edited files/gi },
  { name: "View edited files (general)", regex: /view [^"'{]*edited[^"'{]*file/gi },
  { name: "Searched", regex: /Searched/gi },
  { name: "UI Error string", regex: /(?:children|label|title|text|value|status|prefix|name|message|displayName):\s*["']Error["']/gi },
  { name: "Literal Error string", regex: /"Error"|'Error'/g }
];

let report = "";

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    report += `File not found: ${filePath}\n\n`;
    continue;
  }
  
  report += `========================================\n`;
  report += `FILE: ${filePath}\n`;
  report += `========================================\n`;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  for (const pat of patterns) {
    report += `\n--- Pattern: ${pat.name} ---\n`;
    let match;
    let count = 0;
    
    pat.regex.lastIndex = 0;
    
    while ((match = pat.regex.exec(content)) !== null) {
      count++;
      const index = match.index;
      const matchedText = match[0];
      
      const start = Math.max(0, index - 80);
      const end = Math.min(content.length, index + matchedText.length + 80);
      const snippet = content.substring(start, end).replace(/\n/g, ' ');
      
      report += `  [Match ${count}] Found "${matchedText}" at position ${index}\n`;
      report += `  Snippet: ... ${snippet} ...\n\n`;
      
      if (pat.name === "Literal Error string" && count >= 10) {
        report += `  (Truncated literal error list after 10 matches)\n`;
        break;
      }
    }
    
    if (count === 0) {
      report += `  No matches found.\n`;
    } else {
      report += `  Total matches: ${count}\n`;
    }
  }
  report += `\n`;
}

fs.writeFileSync('scratch/filtered_results.txt', report, 'utf8');
console.log("Precise scan completed. Results written to scratch/filtered_results.txt");
