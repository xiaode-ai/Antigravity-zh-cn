import fs from 'fs';
import path from 'path';

const extJsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extJsPath)) {
  console.log('antigravity/dist/extension.js not found.');
  process.exit(1);
}

const content = fs.readFileSync(extJsPath, 'utf8');

const regexes = [
  /limited/gi,
  /time/gi,
  /Fast/gi,
  /Settings/gi,
  /Docs/gi,
  /Changelog/gi,
  /Report/gi,
  /Agent/gi,
  /Files/gi,
  /Directories/gi,
  /Code Context/gi
];

regexes.forEach(regex => {
  let match;
  let count = 0;
  console.log(`\n=== Pattern: ${regex.toString()} ===`);
  while ((match = regex.exec(content)) !== null) {
    count++;
    if (count > 20) {
      console.log('Too many matches, truncated.');
      break;
    }
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`Match ${count} at index ${idx}: "${match[0]}"`);
    console.log(`  Snippet: ... ${snippet} ...`);
  }
});
