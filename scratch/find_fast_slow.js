import fs from 'fs';

const files = [
  { name: 'main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak' },
  { name: 'workbench.desktop.main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak' }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) return;
  console.log(`\n=================== ${f.name} ===================`);
  const content = fs.readFileSync(f.path, 'utf8');
  
  // Find "Fast" or "Slow" or "Limited"
  const regex = /"Fast"|"Slow"|"Limited"|"Limited time"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    console.log(`  Match: ${match[0]} at index ${idx}`);
    console.log(`    Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
});
