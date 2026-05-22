import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
if (!fs.existsSync(nlsPath)) {
  console.log('Main NLS not found!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

data.forEach((val, idx) => {
  if (val === 'Agent') {
    console.log(`[EXACT MATCH] Index ${idx}: "${val}"`);
  }
});
