import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const mainContent = fs.readFileSync(mainPath, 'utf8');

// Regex to find setting definitions: [Mr.SOMETHING, { ... settingType:"dropdown" ... }]
// Since they are defined in an array of arrays, let's find all occurrences of settingType:"dropdown"
let idx = 0;
while (true) {
  idx = mainContent.indexOf('settingType:"dropdown"', idx);
  if (idx === -1) break;
  // find the start of the setting definition (e.g. the preceding "[Mr.")
  let startIdx = mainContent.lastIndexOf('[Mr.', idx);
  if (startIdx === -1 || idx - startIdx > 1500) {
    startIdx = idx - 200;
  }
  console.log(`\nDropdown setting found at index ${startIdx}:`);
  console.log(mainContent.substring(startIdx, idx + 400));
  idx += 22;
}
