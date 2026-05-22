import fs from 'fs';

const files = [
  { name: 'main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak' },
  { name: 'workbench.desktop.main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak' }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) return;
  console.log(`\n=================== ${f.name} ===================`);
  const content = fs.readFileSync(f.path, 'utf8');
  
  // Find getRenderInfo containing "Files", "Directories", "Code Context Items"
  let idx = 0;
  while (true) {
    idx = content.indexOf('getRenderInfo()', idx);
    if (idx === -1) break;
    
    // Grab the next 300 characters
    const sub = content.substring(idx, idx + 300);
    if (sub.includes('Files') && sub.includes('Directories')) {
      console.log(`Found matching getRenderInfo at index ${idx}:`);
      console.log(`  ${sub.replace(/\r?\n/g, ' ')}`);
    }
    idx += 15; // move past getRenderInfo()
  }
});
