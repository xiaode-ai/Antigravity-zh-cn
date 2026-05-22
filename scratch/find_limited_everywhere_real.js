import fs from 'fs';
import path from 'path';

const searchDirs = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app',
  'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp'
];

const targetPattern = /limited\s+time/i;

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, callback);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.js', '.json', '.html', '.txt'].includes(ext)) {
        callback(fullPath);
      }
    }
  });
}

console.log('Starting search for "limited time"...');

searchDirs.forEach(dir => {
  walk(dir, (file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (targetPattern.test(content)) {
        console.log(`\n[FOUND] in file: ${file}`);
        // Print occurrences
        let match;
        const regex = /limited\s+time/gi;
        while ((match = regex.exec(content)) !== null) {
          const idx = match.index;
          const start = Math.max(0, idx - 80);
          const end = Math.min(content.length, idx + match[0].length + 80);
          console.log(`  Index ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
        }
      }
    } catch (e) {
      // ignore read errors
    }
  });
});

console.log('\nSearch completed.');
