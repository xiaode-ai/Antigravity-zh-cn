import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walkAndSearch(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      return;
    }
    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git') return;
      walkAndSearch(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.txt')) {
      if (file.endsWith('.bak')) return;
      
      let content;
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (err) {
        return;
      }
      
      const regex = /limit/gi;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const idx = match.index;
        const start = Math.max(0, idx - 80);
        const end = Math.min(content.length, idx + match[0].length + 80);
        const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
        if (snippet.toLowerCase().includes('time')) {
          console.log(`[FOUND LIMIT+TIME] File: ${fullPath}`);
          console.log(`  Snippet: ... ${snippet} ...\n`);
        }
      }
    }
  });
}

console.log('Searching for limit + time...');
walkAndSearch(appDir);
console.log('Search finished.');
