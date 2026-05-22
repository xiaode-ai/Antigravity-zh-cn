import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

function searchTerms(content, name) {
  if (!content) return;
  console.log(`=== SEARCH IN ${name} ===`);
  const terms = ['"pages"', '"page"', '`pages`', '`page`', '0 pages', '0 个页面'];
  terms.forEach(t => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(t, idx);
      if (idx === -1) break;
      occurrences.push(idx);
      idx += t.length;
    }
    console.log(`- "${t}": found ${occurrences.length} times`);
    occurrences.forEach((pos, i) => {
      if (occurrences.length > 10 && i >= 5) return;
      console.log(`  Match ${i+1} at ${pos}: ${content.substring(pos - 100, pos + t.length + 100).replace(/\r?\n/g, ' ')}`);
    });
  });
}

searchTerms(mainContent, 'main.js.bak');
searchTerms(wbContent, 'workbench.desktop.main.js.bak');
