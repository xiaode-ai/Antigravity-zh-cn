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
  },
  {
    name: 'extension.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak'
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

files.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) return;
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  console.log(`\n================== ${fileInfo.name} ==================`);
  
  targets.forEach(target => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 80);
      const end = Math.min(content.length, idx + target.length + 80);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      // Filter to things that look like React render elements / labels / UI
      const isCandidate = context.includes('label:') || 
                          context.includes('title:') || 
                          context.includes('children:') || 
                          context.includes('placeholder:') ||
                          context.includes('tooltip:') ||
                          context.includes('description:') ||
                          context.includes('p("span"') ||
                          context.includes('R("span"') ||
                          context.includes('"') ||
                          context.includes("'") ||
                          context.includes('`');
      
      if (isCandidate) {
        occurrences.push({ pos: idx, context });
      }
      idx += target.length;
    }
    
    if (occurrences.length > 0) {
      console.log(`\n--- "${target}" (${occurrences.length} matches):`);
      occurrences.slice(0, 10).forEach((occ, i) => {
        console.log(`  [${i+1}] Pos ${occ.pos}: ${occ.context}`);
      });
      if (occurrences.length > 10) {
        console.log(`  ... and ${occurrences.length - 10} more matches.`);
      }
    }
  });
});
