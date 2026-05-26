import fs from 'fs';

const nlsBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak";
const nlsData = JSON.parse(fs.readFileSync(nlsBak, 'utf8'));

nlsData.forEach((val, idx) => {
  if (typeof val === 'string' && val.toLowerCase().includes("open folder")) {
    console.log(`Index: ${idx} => "${val}"`);
  }
});
