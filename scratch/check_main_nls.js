import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
if (!fs.existsSync(nlsPath)) {
  console.log('Main NLS not found!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
console.log(`Main NLS length: ${data.length}`);

data.forEach((val, idx) => {
  if (typeof val === 'string') {
    if (val.toLowerCase().includes('limited')) {
      console.log(`[limited] Index ${idx}: "${val}"`);
    }
  }
});
