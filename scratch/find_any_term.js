import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'out', 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'out', 'vs', 'workbench', 'workbench.desktop.main.js.bak') },
  { name: 'nls.messages.json.bak', path: path.join(targetDir, 'out', 'nls.messages.json.bak') },
  { name: 'extension.js', path: path.join(targetDir, 'extensions', 'antigravity', 'dist', 'extension.js') }
];

const terms = [
  'Code Context Items',
  'Code Context',
  'Limited time',
  'Fast',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Docs',
  'Report Issue',
  'Changelog',
  'Antigravity - Settings',
  'Directories',
  'Files'
];

let output = [];
function log(msg) {
  console.log(msg);
  output.push(msg);
}

terms.forEach(term => {
  log(`\n=== Searching for: "${term}" ===`);
  files.forEach(f => {
    if (!fs.existsSync(f.path)) {
      return;
    }
    const content = fs.readFileSync(f.path, 'utf8');
    
    // 如果是 nls.messages.json.bak，可以用 JSON 解析
    if (f.name === 'nls.messages.json.bak') {
      try {
        const nls = JSON.parse(content);
        nls.forEach((val, idx) => {
          if (typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())) {
            log(`  [NLS] Found at index ${idx}: "${val}"`);
          }
        });
      } catch (e) {
        log(`  [NLS] JSON parse error: ${e.message}`);
      }
      return;
    }

    // 否则用正则或 indexOf
    let idx = 0;
    let count = 0;
    while ((idx = content.indexOf(term, idx)) !== -1) {
      count++;
      if (count > 20) {
        log(`  [${f.name}] Too many matches, skipping remaining...`);
        break;
      }
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + term.length + 100);
      const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
      log(`  [${f.name}] Found at index ${idx}: ... ${snippet} ...`);
      idx += term.length;
    }
  });
});

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'find_any_term_results.txt'), output.join('\n'), 'utf8');
log(`\n[OK] Wrote results to scratch/find_any_term_results.txt`);
