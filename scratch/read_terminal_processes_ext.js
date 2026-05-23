import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

function search(filePath, name) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================= SEARCHING IN ${name} =================`);
  
  const keywords = ['background', 'processes', 'processes running', '后台进程'];
  keywords.forEach(kw => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(kw, idx);
      if (idx === -1) break;
      count++;
      if (count <= 10) {
        const start = Math.max(0, idx - 100);
        const end = Math.min(content.length, idx + kw.length + 100);
        console.log(`[${kw}] at ${idx}: ... ${content.substring(start, end).replace(/\n/g, ' ')} ...`);
      }
      idx += kw.length;
    }
    console.log(`Keyword [${kw}] total matches: ${count}`);
  });
}

search(extPath, 'extension.js');
