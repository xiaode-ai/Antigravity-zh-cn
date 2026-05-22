import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainBakPath)) {
  console.log('jetskiAgent/main.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(mainBakPath, 'utf8');
console.log(`main.js.bak length: ${content.length}`);

// We will search case-insensitively for "limited" and print its context
let regex = /limited/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const idx = match.index;
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + match[0].length + 100);
  console.log(`Found "limited" at index ${idx}:`);
  console.log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
}

// We will search case-insensitively for "time" and print context if it's near "limited"
// Let's search for any occurrence of "limited" and "time" within 50 chars of each other
let nearRegex = /limited.{0,50}time|time.{0,50}limited/gi;
let nearMatch;
let nearCount = 0;
while ((nearMatch = nearRegex.exec(content)) !== null) {
  nearCount++;
  const idx = nearMatch.index;
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + nearMatch[0].length + 100);
  console.log(`[NEAR MATCH #${nearCount}] at index ${idx}:`);
  console.log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
}
