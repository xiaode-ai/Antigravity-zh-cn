import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json';
const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

const targets = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'Review',
  'files changed',
  '{0} files changed',
  'Editor-Specific Settings',
  'Move changes to main',
  'Good response',
  'Bad response',
  'Copy',
  'Copied'
];

targets.forEach(target => {
  console.log(`\nSearching for: "${target}"`);
  data.forEach((val, idx) => {
    if (typeof val === 'string') {
      if (val === target) {
        console.log(`  [EXACT] Index ${idx}: "${val}"`);
      } else if (val.toLowerCase() === target.toLowerCase()) {
        console.log(`  [CASE-INSENSITIVE EXACT] Index ${idx}: "${val}"`);
      }
    }
  });
});
