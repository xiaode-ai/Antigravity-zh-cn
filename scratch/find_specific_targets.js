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
  { name: "View \\d+ edited files", regex: /View \d+ edited files/gi },
  { name: "View.*edited.*file", regex: /View.*edited.*file/gi },
  { name: "edited.*file", regex: /edited.*file/gi },
  { name: "Searched", regex: /Searched/gi },
  { name: "Error", regex: /Error/gi }
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
    
    // Reset regex lastIndex
    pat.regex.lastIndex = 0;
    
    while ((match = pat.regex.exec(content)) !== null) {
      count++;
      const index = match.index;
      const matchedText = match[0];
      
      // Get context around match
      const start = Math.max(0, index - 150);
      const end = Math.min(content.length, index + matchedText.length + 150);
      const snippet = content.substring(start, end).replace(/\n/g, ' ');
      
      report += `  [Match ${count}] Found "${matchedText}" at position ${index}\n`;
      report += `  Snippet: ... ${snippet} ...\n\n`;
      
      // Limit to first 30 matches for 'Error' to avoid bloating the report too much (since 'Error' is very common in code/constructors)
      if (pat.name === "Error" && count >= 30) {
        report += `  (Truncated after 30 matches for 'Error')\n`;
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

fs.writeFileSync('scratch/specific_targets_results.txt', report, 'utf8');
console.log("Scan completed. Results written to scratch/specific_targets_results.txt");
