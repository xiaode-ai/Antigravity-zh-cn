import fs from 'fs';
import path from 'path';

const filePath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\temp_debug_main.js';
const content = fs.readFileSync(filePath, 'utf8');

const startIdx = 9860000;
const endIdx = 9866000;

console.log(content.substring(startIdx, endIdx));
