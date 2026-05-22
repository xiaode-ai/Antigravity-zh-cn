import fs from 'fs';

const files = [
  { name: 'main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak' },
  { name: 'workbench.desktop.main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak' }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) return;
  console.log(`\n=================== ${f.name} ===================`);
  const content = fs.readFileSync(f.path, 'utf8');
  
  // We search for "limited" case-insensitively, and check if "time" is nearby (within 200 chars)
  const regex = /limited/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    const idx = match.index;
    const start = Math.max(0, idx - 200);
    const end = Math.min(content.length, idx + 200);
    const context = content.substring(start, end);
    if (/time/i.test(context)) {
      count++;
      console.log(`  [Match #${count}] at index ${idx}:`);
      console.log(`    ... ${context.replace(/\r?\n/g, ' ')} ...`);
    }
  }
});
