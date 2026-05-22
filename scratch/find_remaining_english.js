import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const searchPatterns = [
  { name: 'shortcuts', regex: /shortcuts/gi },
  { name: 'Reset to default', regex: /Reset to default/gi },
  { name: 'Processes Running', regex: /Processes\s*Running/gi },
  { name: 'Process Running', regex: /Process\s*Running/gi },
  { name: 'Terminal (', regex: /Terminal\s*\(/gi },
  { name: 'pages template', regex: /[\w"'{`\s]+pages[\w"'}`,`\s]+/gi }
];

console.log('=== SEARCHING FOR DYNAMIC TEMPLATES ===');

function doSearch(content, filename) {
  if (!content) return;
  console.log(`\nFile: ${filename}`);
  
  searchPatterns.forEach(pattern => {
    let match;
    const matches = [];
    pattern.regex.lastIndex = 0; // reset
    while ((match = pattern.regex.exec(content)) !== null) {
      matches.push(match.index);
      if (matches.length > 50) break; // limit
    }
    
    console.log(`  Pattern "${pattern.name}" (${pattern.regex.toString()}): found ${matches.length} occurrences.`);
    matches.slice(0, 15).forEach((idx, i) => {
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + 100);
      const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
      console.log(`    [#${i+1}] At ${idx}: ... ${snippet} ...`);
    });
  });
}

doSearch(mainContent, 'main.js.bak');
doSearch(wbContent, 'workbench.desktop.main.js.bak');
