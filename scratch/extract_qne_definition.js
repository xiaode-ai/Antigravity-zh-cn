import fs from 'fs';
import path from 'path';

const filePath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\temp_debug_main.js';
const content = fs.readFileSync(filePath, 'utf8');

const term = 'qne=';
let idx = content.indexOf(term);
if (idx === -1) {
  idx = content.indexOf('function qne');
}
if (idx !== -1) {
  console.log(`Found qne at index ${idx}:`);
  console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 2000)));
} else {
  console.log('qne definition not found');
}
