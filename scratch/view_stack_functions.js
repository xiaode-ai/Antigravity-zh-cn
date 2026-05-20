import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');
const lines = content.split('\n');
const line = lines[3659]; // line 3660

const functionsToFind = ['Aot', 'yot', 'rMr', 'KPr', 'sza', 'oza'];

console.log('=== Function inspection in line 3660 ===');
for (const fn of functionsToFind) {
  // Let's find "function name(" or "name=" or similar
  const pattern = `function ${fn}(`;
  const idx = line.indexOf(pattern);
  if (idx !== -1) {
    const end = Math.min(line.length, idx + 400);
    console.log(`\nFound ${pattern} at index ${idx}:`);
    console.log(line.substring(idx, end));
  } else {
    console.log(`\nCould not find function ${fn}`);
  }
}
