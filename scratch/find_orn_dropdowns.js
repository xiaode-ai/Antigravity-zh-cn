import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const startIdx = content.indexOf('oRn=');
const nextFuncIdx = content.indexOf('var ', startIdx + 10);
const ornContent = content.substring(startIdx, nextFuncIdx === -1 ? content.length : nextFuncIdx + 2000);

console.log('Search for artifactReviewMode in oRn:');
let idx = 0;
while (true) {
  idx = ornContent.indexOf('artifactReviewMode', idx);
  if (idx === -1) break;
  console.log(`\nFound at offset ${idx}:`);
  console.log(ornContent.substring(idx - 100, idx + 800));
  idx += 'artifactReviewMode'.length;
}
