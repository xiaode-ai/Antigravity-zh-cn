import fs from 'fs';
import path from 'path';

const filePath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\temp_debug_main.js';
const content = fs.readFileSync(filePath, 'utf8');

const term = 'eae=';
let idx = content.indexOf(term);
if (idx === -1) {
  idx = content.indexOf('function eae');
}
if (idx !== -1) {
  console.log(`Found eae at index ${idx}:`);
  console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 2000)));
} else {
  console.log('eae definition not found');
}
