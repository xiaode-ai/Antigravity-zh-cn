import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const targets = ['function Rbn(', 'var Rbn=', 'let Rbn=', 'Rbn='];
targets.forEach(target => {
  let idx = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    console.log(`\nFound ${target} at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 800));
    idx += target.length;
  }
});
