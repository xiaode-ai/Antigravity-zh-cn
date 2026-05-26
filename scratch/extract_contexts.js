import fs from 'fs';
import path from 'path';

const workbenchBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak";
const mainBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak";

const queries = [
  "Clone Repository",
  "Workspaces",
  "Google Extensions",
  "Set up your AI Security Companion",
  "Google Data Cloud for your intelligent IDE",
  "Get Started",
  "Download"
];

let report = "";

function search(filePath) {
  if (!fs.existsSync(filePath)) return;
  report += `\n==========================================\n`;
  report += `FILE: ${filePath}\n`;
  report += `==========================================\n`;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const q of queries) {
    let pos = 0;
    while ((pos = content.indexOf(q, pos)) !== -1) {
      const start = Math.max(0, pos - 120);
      const end = Math.min(content.length, pos + 180);
      report += `▶ KEYWORD: "${q}" at Pos: ${pos}\n`;
      report += `  CONTEXT: ...${content.substring(start, end).replace(/\n/g, ' ')}...\n\n`;
      pos += q.length;
    }
  }
}

search(workbenchBak);
search(mainBak);

fs.writeFileSync("scratch/match_report.txt", report, "utf8");
console.log("Report generated at scratch/match_report.txt");
