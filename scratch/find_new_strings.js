import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const extDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\extensions';

const filesToSearch = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(outDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'jetskiAgent/main.js', path: path.join(outDir, 'jetskiAgent', 'main.js') },
  { name: 'vs/workbench/workbench.desktop.main.js.bak', path: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') },
  { name: 'vs/workbench/workbench.desktop.main.js', path: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js') },
  { name: 'extension.js.bak', path: path.join(extDir, 'antigravity', 'dist', 'extension.js.bak') },
  { name: 'extension.js', path: path.join(extDir, 'antigravity', 'dist', 'extension.js') },
  { name: 'main.js.bak', path: path.join(outDir, 'main.js.bak') },
  { name: 'main.js', path: path.join(outDir, 'main.js') }
];

const targetSubstrings = [
  "Browser",
  "Compacting",
  "Search for files edited by Agent",
  "Comment (Ctrl+Alt+M)",
  "Comment (Ctrl + Alt + M)",
  "Submit (Enter)",
  "Submit (Enter",
  "Skip (esc)",
  "Skip All (Ctrl+esc)",
  "Skip All (Ctrl + esc)",
  "Allow read access to this path?",
  "Yes, allow this time",
  "Yes, and always allow",
  "No (tell the agent what to do instead)"
];

const results = [];

targetSubstrings.forEach(target => {
  results.push(`\n=================== SEARCHING FOR "${target}" ===================`);
  
  filesToSearch.forEach(fileObj => {
    if (!fs.existsSync(fileObj.path)) return;
    
    try {
      const content = fs.readFileSync(fileObj.path, 'utf8');
      let index = 0;
      let count = 0;
      
      while (true) {
        const foundIndex = content.indexOf(target, index);
        if (foundIndex === -1) break;
        count++;
        
        const start = Math.max(0, foundIndex - 150);
        const end = Math.min(content.length, foundIndex + target.length + 150);
        const context = content.substring(start, end).replace(/\r?\n/g, ' ');
        
        results.push(`[FOUND in ${fileObj.name}] match #${count} at index ${foundIndex}:`);
        results.push(`   ... ${context} ...`);
        
        index = foundIndex + 1;
      }
      
      if (count > 0) {
        results.push(`=> Found ${count} matches in ${fileObj.name}`);
      }
    } catch (err) {
      results.push(`Error reading ${fileObj.name}: ${err.message}`);
    }
  });
});

fs.writeFileSync('scratch/new_strings_found.txt', results.join('\n'), 'utf8');
console.log('Search finished. Results written to scratch/new_strings_found.txt');

