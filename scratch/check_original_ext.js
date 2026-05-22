import fs from 'fs';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extPath)) {
  console.log('File not found');
  process.exit(1);
}

const content = fs.readFileSync(extPath, 'utf8');
const containsFFFD = /\uFFFD/.test(content);
console.log('Original extension.js contains U+FFFD:', containsFFFD);

if (containsFFFD) {
  // Find where they are and print context
  let match;
  const regex = /\uFFFD/g;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
    if (count > 5) {
      console.log('Too many matches, stopping print.');
      break;
    }
    const idx = match.index;
    const start = Math.max(0, idx - 50);
    const end = Math.min(content.length, idx + 50);
    console.log(`Match ${count} at index ${idx}:`);
    console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
}
