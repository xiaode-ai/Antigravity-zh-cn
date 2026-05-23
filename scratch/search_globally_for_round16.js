import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

const targets = [
  'Accept Changes',
  'Accept changes',
  'Edited files',
  'edited files',
  'View 3 edited files',
  'View'
];

function searchDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        searchDirectory(fullPath);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.txt')) {
        let content;
        try {
          content = fs.readFileSync(fullPath, 'utf8');
        } catch (e) {
          continue;
        }
        
        targets.forEach(target => {
          let idx = content.indexOf(target);
          if (idx !== -1) {
            console.log(`Found "${target}" in file: ${fullPath} at position ${idx}`);
            // Print context
            const start = Math.max(0, idx - 100);
            const end = Math.min(content.length, idx + target.length + 100);
            console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
          }
        });
      }
    }
  }
}

console.log('Starting global search...');
searchDirectory(appDir);
console.log('Global search finished!');
