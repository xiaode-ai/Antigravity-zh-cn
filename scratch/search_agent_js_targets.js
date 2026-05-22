import fs from 'fs';
import path from 'path';

const extJsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extJsPath)) {
  console.log('antigravity/dist/extension.js not found.');
  process.exit(1);
}

const content = fs.readFileSync(extJsPath, 'utf8');

const targets = [
  'Limited time',
  'Limited-time',
  'limited time',
  'Limited',
  'limited',
  'Fast',
  'Slow',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Antigravity - Settings',
  'Code Context Items',
  'Report Issue',
  'Changelog',
  'Docs'
];

targets.forEach(t => {
  let idx = 0;
  let count = 0;
  console.log(`\n=== Matches for "${t}" ===`);
  while (true) {
    idx = content.indexOf(t, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + t.length + 100);
    const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`Match ${count} at index ${idx}: "${t}"`);
    console.log(`  Snippet: ... ${snippet} ...`);
    idx += t.length;
  }
});
