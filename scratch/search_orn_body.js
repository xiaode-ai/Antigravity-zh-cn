import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const startIdx = content.indexOf('oRn=');
const nextLargeFuncIdx = content.indexOf('var rFe=', startIdx + 10);
const ornContent = content.substring(startIdx, nextLargeFuncIdx === -1 ? content.length : nextLargeFuncIdx);

console.log('Searching for "turbo" or "always" in oRn body:');
let idx = 0;
const terms = ['"turbo"', '"always"', '"auto"'];
terms.forEach(term => {
  let offset = 0;
  while (true) {
    offset = ornContent.indexOf(term, offset);
    if (offset === -1) break;
    console.log(`\nFound term ${term} at offset ${offset}:`);
    console.log(ornContent.substring(offset - 150, offset + 250));
    offset += term.length;
  }
});
