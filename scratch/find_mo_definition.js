import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

// Let's search for "Mo.THEME_MODE"
const regex = /Mo\.THEME_MODE/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 200, index + 300).replace(/\n/g, ' '));
}
