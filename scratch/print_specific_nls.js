import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json';
const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

const targets = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'Review',
  '{0} files changed'
];

targets.forEach(target => {
  let found = false;
  data.forEach((val, idx) => {
    if (typeof val === 'string' && val === target) {
      console.log(`[EXACT MATCH] Index ${idx}: "${val}"`);
      found = true;
    }
  });
  if (!found) {
    console.log(`[NO EXACT MATCH] "${target}"`);
    // Try partial search and print only short matching strings
    data.forEach((val, idx) => {
      if (typeof val === 'string' && val.includes(target) && val.length < target.length + 15) {
        console.log(`  [PARTIAL MATCH] Index ${idx}: "${val}"`);
      }
    });
  }
});
