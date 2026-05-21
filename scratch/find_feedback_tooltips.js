import fs from 'fs';

const files = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\nSearching in: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Let's find "Good response" and search forwards for tooltips or related text
  const idx = content.indexOf('Good response');
  if (idx !== -1) {
    console.log(`Context: ${content.substring(idx - 150, idx + 450)}`);
  }
});
