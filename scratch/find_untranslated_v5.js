import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';
const extContent = fs.existsSync(extPath) ? fs.readFileSync(extPath, 'utf8') : '';

const searchTerms = [
  "Recording",
  "background processes running",
  "background process",
  "background processes",
  "Browser",
  "Search all convos",
  "Current",
  "Show 2 more",
  "show 2 more",
  "Show ",
  " more...",
  "to navigate",
  "to select",
  "Ran"
];

const results = [];

function search(content, name, terms) {
  if (!content) {
    results.push(`\n\n==================== ${name} NOT FOUND ====================`);
    return;
  }
  results.push(`\n\n==================== SEARCHING IN ${name} ====================`);
  terms.forEach(term => {
    let index = 0;
    let occurrences = [];
    while (true) {
      const idx = content.indexOf(term, index);
      if (idx === -1) break;
      occurrences.push(idx);
      index = idx + term.length;
    }
    
    results.push(`\n--- Term: "${term}" (Total Found: ${occurrences.length}) ---`);
    occurrences.forEach((idx, count) => {
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      results.push(`[${term}] Occur #${count + 1} at Index ${idx}:`);
      results.push(`   ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    });
  });
}

search(mainContent, 'main.js.bak', searchTerms);
search(wbContent, 'workbench.desktop.main.js.bak', searchTerms);
search(extContent, 'extension.js.bak', searchTerms);

fs.writeFileSync('scratch/untranslated_v5_results.txt', results.join('\n'), 'utf8');
console.log('Search completed. Results written to scratch/untranslated_v5_results.txt');
