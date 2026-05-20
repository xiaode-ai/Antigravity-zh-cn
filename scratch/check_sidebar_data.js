import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const targets = [
  'rRn',
  'rRn,',
  '<rRn',
  'p(rRn'
];

targets.forEach(target => {
  console.log(`\n=== Searching for: "${target}" ===`);
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    count++;
    console.log(`[Occurrence ${count}] Index: ${idx}`);
    console.log(content.substring(idx - 150, idx + target.length + 250));
    console.log('-'.repeat(60));
    idx += target.length;
  }
});
