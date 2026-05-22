import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

// We want to find the array indices of elements that are exactly "Limited"
nls.forEach((val, idx) => {
  if (val === 'Limited') {
    console.log(`[Exact Array Index ${idx}] -> "${val}"`);
  }
});
