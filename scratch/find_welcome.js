import fs from 'fs';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak";

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pos = 8243460;
  const start = Math.max(0, pos - 1000);
  const end = Math.min(content.length, pos + 1000);
  console.log(`Context near ${pos}:\n`);
  console.log(content.substring(start, end));
} else {
  console.log(`Not exist: ${filePath}`);
}
