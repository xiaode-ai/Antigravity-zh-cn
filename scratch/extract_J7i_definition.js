import fs from 'fs';
import path from 'path';

const filePath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\temp_debug_main.js';
const content = fs.readFileSync(filePath, 'utf8');

const term = 'J7i=';
let idx = content.indexOf(term);
if (idx === -1) {
  idx = content.indexOf('function J7i');
}
if (idx !== -1) {
  console.log(`Found J7i at index ${idx}:`);
  console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 3000)));
} else {
  console.log('J7i definition not found');
}
