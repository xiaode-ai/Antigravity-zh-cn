import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.css')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

console.log('Scanning files...');
const files = walk(appDir);
console.log(`Found ${files.length} text files. Searching for "limited time"...`);

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const idx = content.toLowerCase().indexOf('limited time');
    if (idx !== -1) {
      console.log(`\n[FOUND] File: ${filePath} at index ${idx}`);
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + 120);
      console.log(`Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    }
  } catch (e) {
    // ignore read errors
  }
});
console.log('Search complete.');
