import fs from 'fs';
import path from 'path';

const workbenchBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak";
const mainBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak";

const queries = [
  "Clone Repository",
  "Workspaces",
  "Google Extensions",
  "Set up your AI Security Companion",
  "Google Data Cloud for your intelligent IDE.",
  "Get Started",
  "Download"
];

function searchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n==========================================`);
  console.log(`FILE: ${filePath}`);
  console.log(`==========================================`);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const q of queries) {
    let pos = 0;
    while ((pos = content.indexOf(q, pos)) !== -1) {
      // 找到匹配，截取前后 150 个字符
      const start = Math.max(0, pos - 150);
      const end = Math.min(content.length, pos + 150);
      console.log(`▶ KEYWORD: "${q}" at Pos: ${pos}`);
      console.log(`  CONTEXT: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
      pos += q.length;
    }
  }
}

searchFile(workbenchBak);
searchFile(mainBak);
