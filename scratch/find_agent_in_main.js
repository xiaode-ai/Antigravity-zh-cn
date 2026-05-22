import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainBakPath)) {
  console.log('jetskiAgent/main.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(mainBakPath, 'utf8');
console.log(`main.js.bak length: ${content.length}`);

// We search for exact "Agent" in main.js.bak
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
  if (count > 40) {
    console.log('  ... too many matches, truncated.');
    break;
  }
}
