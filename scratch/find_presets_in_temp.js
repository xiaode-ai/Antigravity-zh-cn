import fs from 'fs';
import path from 'path';

const filePath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\temp_debug_main.js';
const content = fs.readFileSync(filePath, 'utf8');

const regex = /sandboxed/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  console.log(`--- Match at index ${index} ---`);
  console.log(content.substring(Math.max(0, index - 200), Math.min(content.length, index + 200)));
}
