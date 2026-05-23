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
  'Browser',
  'Search all convos',
  'Current',
  'Show 2 more',
  'to navigate',
  'to select',
  'Ran'
];

let output = '';

files.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) return;
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  output += `\n*** FILE: ${fileInfo.name} ***\n`;
  
  targets.forEach(term => {
    output += `\n-- Term: "${term}" --\n`;
    let idx = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      
      // Grab 150 chars around
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + term.length + 100);
      const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      // Let's filter to UI contexts: e.g. containing labels, quotes, children, etc.
      // Especially: check if it matches common UI patterns
      const lowerSnippet = snippet.toLowerCase();
      const isUI = lowerSnippet.includes('label:') ||
                   lowerSnippet.includes('title:') ||
                   lowerSnippet.includes('placeholder:') ||
                   lowerSnippet.includes('children:') ||
                   lowerSnippet.includes('tooltip:') ||
                   lowerSnippet.includes('description:') ||
                   lowerSnippet.includes('"') ||
                   lowerSnippet.includes("'") ||
                   lowerSnippet.includes('`') ||
                   lowerSnippet.includes('span') ||
                   lowerSnippet.includes('div') ||
                   snippet.includes(term + '"') ||
                   snippet.includes(term + "'") ||
                   snippet.includes(term + '`');
                   
      if (isUI) {
        // Let's see if we can extract the exact literal or property
        // e.g. children:"Recording..." or p("span", {children: "to navigate"})
        output += `  [Pos ${idx}]: ... ${snippet} ...\n`;
      }
      
      idx += term.length;
    }
  });
});

fs.writeFileSync('scratch/user_terms_context_results.txt', output, 'utf8');
console.log('Done filtering user terms context!');
