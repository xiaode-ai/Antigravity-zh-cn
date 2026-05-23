import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.readFileSync(wbPath, 'utf8');

const targetIdx = wbContent.indexOf('to navigate');
const start = Math.max(0, targetIdx - 300);
const end = Math.min(wbContent.length, targetIdx + 300);
console.log('Context of "to navigate":');
console.log(wbContent.substring(start, end));

// Let's print all occurrences of "to select" in workbench
let selectIdx = 0;
while (true) {
  selectIdx = wbContent.indexOf('to select', selectIdx);
  if (selectIdx === -1) break;
  console.log(`\nOccurrence of "to select" at index ${selectIdx}:`);
  console.log(wbContent.substring(selectIdx - 150, selectIdx + 150));
  selectIdx += 'to select'.length;
}
