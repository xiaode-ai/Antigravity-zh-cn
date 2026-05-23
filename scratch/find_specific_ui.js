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
  'Recording',
  'background processes',
  'Browser',
  'Search all convos',
  'Current',
  'Show 2 more',
  'more...',
  'to navigate',
  'to select',
  'Ran'
];

let output = '';

files.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) {
    output += `[WARN] File not found: ${fileInfo.path}\n`;
    return;
  }
  
  output += `\n================== Scanning ${fileInfo.name} ==================\n`;
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  
  targets.forEach(target => {
    let idx = 0;
    const matches = [];
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 120);
      const end = Math.min(content.length, idx + target.length + 120);
      matches.push({
        pos: idx,
        context: content.substring(start, end).replace(/\r?\n/g, ' ')
      });
      idx += target.length;
    }
    
    // Filter matches that look like UI strings
    const uiMatches = matches.filter(m => {
      const lower = m.context.toLowerCase();
      return lower.includes('label:') ||
             lower.includes('title:') ||
             lower.includes('placeholder:') ||
             lower.includes('children:') ||
             lower.includes('tooltip:') ||
             lower.includes('description:') ||
             lower.includes('"') ||
             lower.includes("'") ||
             lower.includes('`');
    });
    
    if (uiMatches.length > 0) {
      output += `\nTarget: "${target}" - Found ${uiMatches.length} potential UI occurrences:\n`;
      uiMatches.forEach((m, i) => {
        output += `  [Match ${i+1} at ${m.pos}]: ... ${m.context} ...\n`;
      });
    }
  });
});

fs.writeFileSync('scratch/find_specific_ui.txt', output, 'utf8');
console.log('Done! Output written to scratch/find_specific_ui.txt');
