import fs from 'fs';

const nlsBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak";
const nlsData = JSON.parse(fs.readFileSync(nlsBak, 'utf8'));

for (let i = 3860; i <= 3900; i++) {
  console.log(`Index: ${i} => "${nlsData[i]}"`);
}
