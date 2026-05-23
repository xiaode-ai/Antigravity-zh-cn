import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

const getMainContent = () => {
  if (fs.existsSync(mainPath)) return fs.readFileSync(mainPath, 'utf8');
  const normalPath = path.join(outDir, 'jetskiAgent', 'main.js');
  return fs.existsSync(normalPath) ? fs.readFileSync(normalPath, 'utf8') : '';
};

const getWbContent = () => {
  if (fs.existsSync(wbPath)) return fs.readFileSync(wbPath, 'utf8');
  const normalPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');
  return fs.existsSync(normalPath) ? fs.readFileSync(normalPath, 'utf8') : '';
};

const getExtContent = () => {
  if (fs.existsSync(extPath)) return fs.readFileSync(extPath, 'utf8');
  const normalPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';
  return fs.existsSync(normalPath) ? fs.readFileSync(normalPath, 'utf8') : '';
};

const mainContent = getMainContent();
const wbContent = getWbContent();
const extContent = getExtContent();

const searchTerms = [
  'mcp store',
  'mcpstore',
  'mcp-store',
  'mcp registry',
  'mcp-registry',
  'mcp server store',
  'store'
];

const results = [];

function search(content, name, terms) {
  if (!content) {
    results.push(`[INFO] File ${name} does not exist or is empty.`);
    return;
  }
  results.push(`\n\n==================== SEARCHING IN ${name} ====================`);
  terms.forEach(term => {
    let index = 0;
    let occurrences = [];
    // Case-insensitive search
    const lowerContent = content.toLowerCase();
    const lowerTerm = term.toLowerCase();
    while (true) {
      const idx = lowerContent.indexOf(lowerTerm, index);
      if (idx === -1) break;
      occurrences.push(idx);
      index = idx + 1;
    }
    
    results.push(`\n--- Term: "${term}" (Total Found: ${occurrences.length}) ---`);
    occurrences.slice(0, 100).forEach((idx, count) => {
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      results.push(`[${term}] Occur #${count + 1} at Index ${idx}:`);
      results.push(`   ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    });
    if (occurrences.length > 100) {
      results.push(`   ... and ${occurrences.length - 100} more matches`);
    }
  });
}

search(mainContent, 'main.js', searchTerms);
search(wbContent, 'workbench.desktop.main.js', searchTerms);
search(extContent, 'extension.js', searchTerms);

fs.writeFileSync('scratch/mcp_store_search_results.txt', results.join('\n'), 'utf8');
console.log('Search completed. Results written to scratch/mcp_store_search_results.txt');
