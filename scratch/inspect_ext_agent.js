import fs from 'fs';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';
if (!fs.existsSync(extPath)) {
  console.log('extension.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(extPath, 'utf8');
console.log(`extension.js.bak length: ${content.length}`);

// We search for exact "Agent" in extension.js.bak
const regex = /"Agent"|'Agent'|`Agent`/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  const idx = match.index;
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + match[0].length + 100);
  console.log(`  [Match #${count}] at index ${idx}:`);
  console.log(`    ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
}
