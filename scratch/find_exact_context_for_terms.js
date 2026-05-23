import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';
const extContent = fs.existsSync(extPath) ? fs.readFileSync(extPath, 'utf8') : '';

const targets = [
  { name: 'to navigate', query: 'to navigate' },
  { name: 'to select', query: 'to select' },
  { name: 'Search all convos', query: 'Search all convos' },
  { name: 'Recording...', query: 'Recording...' },
  { name: 'Recording', query: '"Recording"' },
  { name: 'Processing', query: '"Processing"' },
  { name: 'Record Audio', query: 'Record Audio' },
  { name: 'Stop Recording', query: 'Stop Recording' },
  { name: 'Browser', query: 'Browser' },
  { name: 'Current', query: 'current window' },
  { name: 'Show more', query: 'Show ' },
  { name: 'Ran status', query: 'Ran' }
];

let output = '';
function log(msg) {
  output += msg + '\n';
}

function search(content, fileName) {
  if (!content) return;
  log(`\n==================== ${fileName} ====================`);
  targets.forEach(t => {
    let index = 0;
    let occurrences = [];
    while (true) {
      const idx = content.indexOf(t.query, index);
      if (idx === -1) break;
      occurrences.push(idx);
      index = idx + 1;
    }
    
    log(`\n--- Target: "${t.name}" (query: "${t.query}", total: ${occurrences.length}) ---`);
    let matchesPrinted = 0;
    for (let i = 0; i < occurrences.length; i++) {
      const idx = occurrences[i];
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + t.query.length + 150);
      const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      // Let's filter matches for generic words like "Ran" or "Browser" or "Show" to see if they look like UI text
      let isInteresting = true;
      if (t.name === 'Ran status') {
        // We only care if it's "Ran" as a status, e.g., status === "Ran" or "Ran" in a list or UI children:"Ran"
        isInteresting = snippet.includes('"Ran"') || snippet.includes("'Ran'") || snippet.includes('children:"Ran"') || snippet.includes('status:');
      }
      if (t.name === 'Browser') {
        isInteresting = snippet.includes('label:') || snippet.includes('title:') || snippet.includes('children:') || snippet.includes('tab') || snippet.includes('Browser') && (snippet.includes('"') || snippet.includes("'"));
      }
      if (t.name === 'Show more') {
        isInteresting = snippet.includes('Show ') && (snippet.includes('more') || snippet.includes('{0}'));
      }
      
      if (isInteresting) {
        matchesPrinted++;
        log(`Match #${matchesPrinted} at Index ${idx}:`);
        log(`   ... ${snippet} ...`);
        if (matchesPrinted >= 30) {
          log(`   ... truncated remaining interesting matches`);
          break;
        }
      }
    }
  });
}

search(mainContent, 'main.js');
search(wbContent, 'workbench.desktop.main.js');
search(extContent, 'extension.js');

fs.writeFileSync('scratch/specific_targets_results_interesting.txt', output, 'utf8');
console.log('Results written to scratch/specific_targets_results_interesting.txt');
