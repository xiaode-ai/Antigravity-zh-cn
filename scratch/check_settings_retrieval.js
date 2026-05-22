import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Search for ARTIFACT_REVIEW_MODE usage
let idx = 0;
while (true) {
  idx = bakContent.indexOf('ARTIFACT_REVIEW_MODE', idx);
  if (idx === -1) break;
  console.log(`\nFound ARTIFACT_REVIEW_MODE at index ${idx}:`);
  console.log(bakContent.substring(idx - 150, idx + 600));
  idx += 20;
}
