import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

// Get more context before the Email label to find what 'a' is
const searchStr = 'label:"Email",description:a?';
const pos = content.indexOf(searchStr);
if (pos !== -1) {
  // Get 1000 chars before to find the function/component definition
  const start = Math.max(0, pos - 1500);
  const end = Math.min(content.length, pos + 500);
  const context = content.substring(start, end);
  console.log(context);
} else {
  console.log('Not found');
}
