import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');
const regex = /AUTOCOMPLETE_SPEED/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  console.log(`\n--- Match at index ${index} ---`);
  console.log(content.substring(index - 500, index + 1000).replace(/\n/g, ' '));
}
