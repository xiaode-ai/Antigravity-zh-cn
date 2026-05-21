import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      results.push(filePath);
    }
  });
  return results;
}

console.log('Scanning files...');
const allFiles = walk(appDir);
console.log(`Found ${allFiles.length} files. Searching for "Toggle Agent"...`);

allFiles.forEach(file => {
  if (file.endsWith('.bak')) return;
  // Read file if it's text/json/js/html
  const ext = path.extname(file);
  if (['.js', '.json', '.html', '.css', '.txt'].includes(ext)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.toLowerCase().includes('toggle agent')) {
        console.log(`[FOUND in file] ${file}`);
        // Find indices or occurrences
        let idx = 0;
        while (true) {
          idx = content.toLowerCase().indexOf('toggle agent', idx);
          if (idx === -1) break;
          console.log(`   Context around ${idx}: ... ${content.substring(Math.max(0, idx - 50), Math.min(content.length, idx + 80)).replace(/\r?\n/g, ' ')} ...`);
          idx += 12;
        }
      }
    } catch (e) {
      // ignore read errors
    }
  }
});
