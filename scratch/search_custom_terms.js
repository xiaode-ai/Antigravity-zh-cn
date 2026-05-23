import fs from 'fs';
import path from 'path';

const searchRoot = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

const keywords = [
  'Authenticating',
  'AI Credits',
  'Credits',
  'See Activity',
  'Get More AI',
  'Recording...'
];

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

const outputLines = [];
function log(msg) {
  console.log(msg);
  outputLines.push(msg);
}

log('Scanning files in ' + searchRoot);
const allFiles = walk(searchRoot);
log(`Found ${allFiles.length} files. Starting keyword search...`);

allFiles.forEach(file => {
  const ext = path.extname(file);
  if (['.js', '.json', '.html', '.css'].includes(ext)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      keywords.forEach(keyword => {
        let idx = 0;
        let occurrences = [];
        while (true) {
          idx = content.indexOf(keyword, idx);
          if (idx === -1) break;
          occurrences.push(idx);
          idx += keyword.length;
        }
        
        if (occurrences.length > 0) {
          log(`[FOUND] "${keyword}" in ${file} (${occurrences.length} occurrences)`);
          occurrences.forEach((pos, i) => {
            const start = Math.max(0, pos - 150);
            const end = Math.min(content.length, pos + keyword.length + 150);
            log(`  Occurrence #${i + 1} at pos ${pos}:`);
            log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...\n`);
          });
        }
      });
    } catch (e) {
      // ignore
    }
  }
});
fs.writeFileSync('scratch/custom_terms_found.txt', outputLines.join('\n'), 'utf8');
log('Search complete. Results written to scratch/custom_terms_found.txt');

