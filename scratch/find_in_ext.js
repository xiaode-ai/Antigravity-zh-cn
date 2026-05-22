import fs from 'fs';
import path from 'path';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extPath)) {
  console.log('File does not exist:', extPath);
  process.exit(1);
}

const content = fs.readFileSync(extPath, 'utf8');
console.log('Successfully read extension.js. Length:', content.length);

const targets = ['Fast', 'Autocomplete Speed:', 'Jetski - Settings', 'Antigravity - Settings', 'Limited time'];

targets.forEach(target => {
  console.log(`\n=== Searching for "${target}" ===`);
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    count++;
    console.log(`Match ${count} at index ${idx}:`);
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + target.length + 100);
    console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    idx += target.length;
  }
  if (count === 0) {
    console.log('No matches found.');
  }
});
