import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js', 'utf8');

// Find the translated version
const searchStr = 'label:"电子邮箱"';
let pos = 0;
let count = 0;
while ((pos = content.indexOf(searchStr, pos)) !== -1) {
  count++;
  const start = Math.max(0, pos - 200);
  const end = Math.min(content.length, pos + searchStr.length + 300);
  const context = content.substring(start, end);
  console.log(`\n===== Match ${count} at position ${pos} =====`);
  console.log(context);
  console.log('');
  pos += searchStr.length;
}
console.log(`\nTotal matches: ${count}`);
