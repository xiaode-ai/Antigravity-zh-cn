import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Find where e0 is defined or used
const e0Index = bakContent.indexOf('e0=');
if (e0Index !== -1) {
  console.log('Found e0 definition:');
  console.log(bakContent.substring(e0Index - 100, e0Index + 500));
} else {
  console.log('e0= not found. Searching for e0 usage or definition around ARTIFACT_REVIEW_MODE...');
}

// Let's search for "Artifact Review Policy" or "Review Policy" logic in main.js.bak
function findSurrounding(term, lengthBefore = 200, lengthAfter = 800) {
  let idx = 0;
  while (true) {
    idx = bakContent.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`\nFound "${term}" at index ${idx}:`);
    console.log(bakContent.substring(idx - lengthBefore, idx + lengthAfter));
    idx += term.length;
  }
}

console.log('\n--- Searching for artifact review policy rendering ---');
findSurrounding('Artifact Review Policy', 200, 800);
