import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json';
if (!fs.existsSync(nlsPath)) {
  console.log('nls.messages.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
console.log(`nls.messages.json keys count: ${data.length}`);

const terms = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'files changed',
  'Review'
];

data.forEach((val, idx) => {
  terms.forEach(term => {
    if (typeof val === 'string' && val.includes(term)) {
      console.log(`[MATCH] Index ${idx}: "${val}"`);
    }
  });
});
