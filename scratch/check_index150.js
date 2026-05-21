import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(targetPath, 'utf8');

const searchTerms = [
  'tabular-nums text-muted-foreground',
  'b.label',
  'b.color',
  'iFe(b.tokens)'
];

searchTerms.forEach(term => {
  console.log(`\n=================== Search term: "${term}" ===================`);
  let idx = -1;
  let count = 0;
  while ((idx = content.indexOf(term, idx + 1)) !== -1) {
    count++;
    console.log(`[FOUND #${count}] index: ${idx}`);
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + term.length + 150);
    console.log(content.substring(start, end));
    if (count >= 10) break;
  }
});
