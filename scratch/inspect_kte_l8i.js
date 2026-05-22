import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainBakPath)) {
  console.log('jetskiAgent/main.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(mainBakPath, 'utf8');

const searchTerms = ['function kte', 'kte=', 'const kte', 'var kte', 'function l8i', 'l8i=', 'const l8i', 'var l8i'];

searchTerms.forEach(term => {
  let idx = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + 300);
    console.log(`\nFound "${term}" at index ${idx}:`);
    console.log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    
    idx += term.length;
  }
});
