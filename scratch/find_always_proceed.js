import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const targets = [
  'Always Proceed',
  'Always Ask',
];

for (const target of targets) {
  let idx = 0;
  console.log(`\n=== Searching for: ${target} ===`);
  let count = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    count++;
    console.log(`[Occurrence ${count}] Index: ${idx}`);
    console.log(content.substring(idx - 150, idx + 150));
    console.log('-'.repeat(40));
    idx += target.length;
  }
}
