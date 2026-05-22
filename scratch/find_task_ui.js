import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const targets = [
  'delete the scheduled task',
  'Delete Task',
  'Cancel task',
  'Background Task'
];

targets.forEach(term => {
  let idx = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`Found "${term}" at index ${idx}:`);
    console.log(content.substring(idx - 80, idx + 120).replace(/\r?\n/g, ' '));
    idx += term.length;
  }
});
