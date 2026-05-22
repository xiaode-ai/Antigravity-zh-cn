import fs from 'fs';
import path from 'path';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
if (!fs.existsSync(nlsPath)) {
  console.log('nls.messages.json.bak not found');
  process.exit(1);
}

const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

function printAround(idx) {
  console.log(`\n=== Around Index ${idx} ===`);
  for (let i = Math.max(0, idx - 5); i <= Math.min(nls.length - 1, idx + 5); i++) {
    console.log(`[Index ${i}] -> "${nls[i]}"`);
  }
}

printAround(6128);
printAround(6307);
