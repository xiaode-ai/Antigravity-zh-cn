import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

// Find all occurrences of resolveOptionToString
let pos = -1;
let index = 0;
while ((pos = content.indexOf('resolveOptionToString', pos + 1)) !== -1) {
  index++;
  console.log(`\n=== Match #${index} at position ${pos} ===`);
  console.log(content.substring(Math.max(0, pos - 200), Math.min(content.length, pos + 1000)));
}
