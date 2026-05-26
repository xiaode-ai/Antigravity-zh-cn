import fs from 'fs';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak";
const content = fs.readFileSync(filePath, 'utf8');

let pos = 0;
console.log("--- SEARCHING 'clone' IN WORKBENCH BAK (CASE INSENSITIVE) ---");
while ((pos = content.toLowerCase().indexOf("clone", pos)) !== -1) {
  const start = Math.max(0, pos - 100);
  const end = Math.min(content.length, pos + 150);
  console.log(`▶ Pos: ${pos}`);
  console.log(`  Context: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
  pos += 5;
}
