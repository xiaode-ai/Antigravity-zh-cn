import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

const searchTerms = [
  'Limited time',
  'Limited-time',
  'limited time',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Antigravity - Settings',
  'Code Context Items',
  'Report Issue',
  'Changelog'
];

let output = '';
function log(msg) {
  output += msg + '\n';
}

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
      
      searchTerms.forEach(term => {
        let idx = 0;
        let count = 0;
        while (true) {
          idx = content.indexOf(term, idx);
          if (idx === -1) break;
          count++;
          
          const start = Math.max(0, idx - 120);
          const end = Math.min(content.length, idx + term.length + 120);
          const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
          
          log(`[FOUND] File: ${fullPath}`);
          log(`  Term: "${term}" (#${count})`);
          log(`  Snippet: ... ${snippet} ...\n`);
          
          idx += term.length;
        }
      });
    }
  });
}

log('Searching all files in resources/app (excluding node_modules)...');
walkAndSearch(appDir);
log('Search finished.');

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'search_all_out_results.txt'), output, 'utf8');
console.log('Done writing results.');
