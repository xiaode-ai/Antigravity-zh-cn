import fs from 'fs';
import path from 'path';

const rootDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function searchDir(dir, query) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'out-build') return;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      searchDir(fullPath, query);
    } else {
      if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        let idx = 0;
        let found = false;
        while ((idx = content.toLowerCase().indexOf(query.toLowerCase(), idx)) !== -1) {
          if (!found) {
            console.log(`\nFound query "${query}" in file: ${fullPath}`);
            found = true;
          }
          const start = Math.max(0, idx - 100);
          const end = Math.min(content.length, idx + query.length + 100);
          console.log(`  - Index ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
          idx += query.length;
        }
      }
    }
  });
}

console.log("=== Recursive search for 'Limited time' ===");
searchDir(rootDir, 'Limited time');

console.log("\n=== Recursive search for 'Limited' ===");
searchDir(rootDir, 'Limited');
