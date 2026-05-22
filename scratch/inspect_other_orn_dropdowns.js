import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const startIdx = 9866124;
const endIdx = 9875908;
const ornContent = content.substring(startIdx, endIdx);

console.log('Searching for dropdown/resolvers inside oRn component block:');
const terms = ['displayResolver', 'options:'];
terms.forEach(term => {
  let offset = 0;
  while (true) {
    offset = ornContent.indexOf(term, offset);
    if (offset === -1) break;
    console.log(`\nFound term "${term}" at index ${startIdx + offset}:`);
    console.log(content.substring(startIdx + offset - 150, startIdx + offset + 250));
    offset += term.length;
  }
});
