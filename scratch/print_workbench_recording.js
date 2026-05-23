import fs from 'fs';

const wbPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(wbPath, 'utf8');

const targets = [
  'Already recording',
  'No active recording'
];

targets.forEach(t => {
  const idx = content.indexOf(t);
  if (idx !== -1) {
    console.log(`=== Match for "${t}" at ${idx} ===`);
    console.log(content.substring(idx - 150, idx + 150));
  } else {
    console.log(`"${t}" not found`);
  }
});
