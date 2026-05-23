import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js"
];

const patterns = [
  'children:"Error"',
  'children:\'Error\'',
  'title:"Error"',
  'title:\'Error\'',
  'label:"Error"',
  'label:\'Error\'',
  'text:"Error"',
  'text:\'Error\'',
  ':"Error"',
  ':\'Error\''
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n========================================`);
  console.log(`FILE: ${path.basename(filePath)}`);
  console.log(`========================================`);
  
  let foundAny = false;
  for (const pat of patterns) {
    let index = 0;
    let count = 0;
    while (true) {
      index = content.indexOf(pat, index);
      if (index === -1) break;
      count++;
      foundAny = true;
      console.log(`  [Match ${count}] Pattern "${pat}" at Pos ${index}`);
      const start = Math.max(0, index - 120);
      const end = Math.min(content.length, index + pat.length + 120);
      console.log(`  Snippet: ... ${content.substring(start, end).replace(/\n/g, ' ')} ...\n`);
      index += pat.length;
    }
  }
  if (!foundAny) {
    console.log(`  ✅ No hardcoded UI "Error" patterns found!`);
  }
}
