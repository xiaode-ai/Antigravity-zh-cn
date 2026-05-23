import fs from 'fs';
import path from 'path';

const files = [
  {
    name: 'main.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak'
  },
  {
    name: 'workbench.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
  }
];

const targets = [
  'Recording...',
  'background processes',
  'Search all convos',
  'to navigate',
  'to select',
  'Ran',
  'Current',
  'Show 2 more',
  'Browser'
];

let output = '';

files.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) return;
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  output += `\n================== FILE: ${fileInfo.name} ==================\n`;
  
  targets.forEach(term => {
    output += `\n--- Term: "${term}" ---\n`;
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      // Let's filter to UI contexts: e.g. containing labels, quotes, children, etc.
      const lowerContext = context.toLowerCase();
      const isUI = lowerContext.includes('label:') ||
                   lowerContext.includes('title:') ||
                   lowerContext.includes('placeholder:') ||
                   lowerContext.includes('children:') ||
                   lowerContext.includes('tooltip:') ||
                   lowerContext.includes('description:') ||
                   lowerContext.includes('"') ||
                   lowerContext.includes("'") ||
                   lowerContext.includes('`') ||
                   lowerContext.includes('span') ||
                   lowerContext.includes('div') ||
                   context.includes(term + '"') ||
                   context.includes(term + "'") ||
                   context.includes(term + '`');
                   
      if (isUI) {
        count++;
        output += `  [Match ${count} at Pos ${idx}]: ... ${context} ...\n`;
      }
      idx += term.length;
    }
  });
});

fs.writeFileSync('scratch/summarized_remaining.txt', output, 'utf8');
console.log('Saved to scratch/summarized_remaining.txt!');
