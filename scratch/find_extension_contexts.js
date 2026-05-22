import fs from 'fs';
import path from 'path';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extPath)) {
  console.error(`File not found: ${extPath}`);
  process.exit(1);
}

const content = fs.readFileSync(extPath, 'utf8');

function findContext(query) {
  console.log(`\n=== Searching for "${query}" ===`);
  let idx = 0;
  let matches = 0;
  while ((idx = content.indexOf(query, idx)) !== -1) {
    matches++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + query.length + 100);
    const context = content.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`Match ${matches} at index ${idx}:`);
    console.log(`  Context: ... ${context} ...`);
    idx += query.length;
    if (matches >= 20) {
      console.log('Too many matches, stopping print.');
      break;
    }
  }
}

findContext('Autocomplete Speed');
findContext('Autocomplete speed');
findContext('Antigravity - Settings');
findContext('Jetski - Settings');
findContext('SLOW:e="Slow"');
findContext('FAST:e="Fast"');
findContext('options:[sW.FAST,sW.SLOW]');
findContext('options:[{label:');
findContext('isDefaultWhenAvailable:!0}');
