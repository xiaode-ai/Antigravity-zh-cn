import fs from 'fs';
import path from 'path';

const files = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n================== Searching in: ${path.basename(filePath)} ==================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Search for "Copied" and "Copy"
  const targets = ['"Copied":"Copy"', '?"Copied":"Copy"', '?"copied":"copy"'];
  targets.forEach(target => {
    let idx = 0;
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      console.log(`Found ${target} at index ${idx}:`);
      console.log(content.substring(idx - 100, idx + 100));
      idx += target.length;
    }
  });
  
  // Broad search for "Copied" to make sure we don't miss different patterns
  let broadIdx = 0;
  let count = 0;
  while (true) {
    broadIdx = content.indexOf('Copied', broadIdx);
    if (broadIdx === -1) break;
    count++;
    console.log(`  Broad [Copied #${count}] at index ${broadIdx}: ${content.substring(broadIdx - 50, broadIdx + 50)}`);
    broadIdx += 6;
    if (count >= 10) break;
  }
});
