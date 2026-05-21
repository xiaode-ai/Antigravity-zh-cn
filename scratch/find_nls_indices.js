import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json';
const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

const targets = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'Review',
  'files changed'
];

targets.forEach(target => {
  console.log(`\nSearching for exact match or close match to: "${target}"`);
  data.forEach((val, idx) => {
    if (typeof val === 'string') {
      if (val === target) {
        console.log(`  [EXACT] Index ${idx}: "${val}"`);
      } else if (val.toLowerCase().includes(target.toLowerCase())) {
        console.log(`  [PARTIAL] Index ${idx}: "${val}"`);
      }
    }
  });
});
