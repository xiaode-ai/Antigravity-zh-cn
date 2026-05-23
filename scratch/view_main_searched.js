import fs from 'fs';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js.bak";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  let index = 0;
  let count = 0;
  while (true) {
    index = content.indexOf("Searched", index);
    if (index === -1) break;
    
    count++;
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 8 + 50);
    console.log(`[MATCH ${count}] at Pos ${index}:`);
    console.log(content.substring(start, end));
    console.log("");
    
    index += 8;
  }
}
