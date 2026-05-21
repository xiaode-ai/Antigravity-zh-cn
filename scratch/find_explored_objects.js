import fs from 'fs';

const files = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\nSearching in: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Search for the pluralization logic like:
  // e.g. "task" or "tasks"
  const regex = /"task"|"tasks"|"search"|"searches"|"folder"|"folders"|"file"|"files"/g;
  let match;
  const matches = new Set();
  while ((match = regex.exec(content)) !== null) {
    matches.add(match[0]);
    const idx = match.index;
    const start = Math.max(0, idx - 60);
    const end = Math.min(content.length, idx + match[0].length + 60);
    console.log(`  [MATCH] ${match[0]} at index ${idx}: ... ${content.substring(start, end).replace(/\n/g, '\\n')} ...`);
  }
});
