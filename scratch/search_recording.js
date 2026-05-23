import fs from 'fs';
import path from 'path';

const searchRoot = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

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

const allFiles = walk(searchRoot);
console.log(`Found ${allFiles.length} files. Searching for "recording"...`);

allFiles.forEach(file => {
  const ext = path.extname(file);
  if (['.js', '.json', '.html'].includes(ext)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let idx = 0;
      let occurrences = [];
      const query = 'recording';
      while (true) {
        idx = content.toLowerCase().indexOf(query, idx);
        if (idx === -1) break;
        occurrences.push(idx);
        idx += query.length;
      }
      if (occurrences.length > 0) {
        console.log(`[FOUND] "${query}" in ${file} (${occurrences.length} occurrences)`);
        occurrences.forEach((pos, i) => {
          const start = Math.max(0, pos - 100);
          const end = Math.min(content.length, pos + query.length + 100);
          console.log(`  Occurrence #${i + 1} at pos ${pos}:`);
          console.log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...\n`);
        });
      }
    } catch (e) {
      // ignore
    }
  }
});
