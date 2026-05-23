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

function findOccurrences(content, word) {
  const regex = new RegExp(`([^a-zA-Z0-9_'"]|^)(${word})([^a-zA-Z0-9_'"]|$)`, 'gi');
  let match;
  const list = [];
  while ((match = regex.exec(content)) !== null) {
    const idx = match.index + match[1].length;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + word.length + 100);
    list.push({
      pos: idx,
      text: content.substring(start, end).replace(/\r?\n/g, ' ')
    });
  }
  return list;
}

// Target specific phrases and partial words
const targets = [
  'Recording...',
  'Recording',
  'background processes',
  'Browser',
  'Search all convos',
  'Current',
  'Show 2 more',
  'Show ',
  'more...',
  'to navigate',
  'to select',
  'Ran'
];

files.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) {
    console.log(`[WARN] File not found: ${fileInfo.path}`);
    return;
  }
  
  console.log(`\n================== Scanning ${fileInfo.name} ==================`);
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
    
    // Filter matches that look like UI strings (containing quotes, object attributes, label, title, children etc.)
    const uiMatches = matches.filter(m => {
      const lower = m.context.toLowerCase();
      // Look for:
      // label: "...", title: "...", placeholder: "...", children: "...", tooltip: "...", or quotes around the target,
      // or things like p("span", {children: ...}), or template literals, or simple string literals in arrays.
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
      console.log(`\nTarget: "${target}" - Found ${uiMatches.length} potential UI occurrences:`);
      uiMatches.slice(0, 15).forEach((m, i) => {
        console.log(`  [Match ${i+1} at ${m.pos}]: ... ${m.context} ...`);
      });
      if (uiMatches.length > 15) {
        console.log(`  ... and ${uiMatches.length - 15} more matches.`);
      }
    }
  });
});
