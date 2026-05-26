import fs from 'fs';
import path from 'path';

const config = {
  targetFilePath: "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js"
};

const pathsToSearch = [
  config.targetFilePath + '.bak',
  path.join(path.dirname(config.targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js.bak'),
  path.join(path.dirname(config.targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js.bak'),
  path.join(path.dirname(config.targetFilePath), '..', 'main.js.bak')
];

const queries = [
  "Security Companion",
  "Clone Repository",
  "Workspaces",
  "Google Extensions",
  "Get Started",
  "Download"
];

for (const filePath of pathsToSearch) {
  if (!fs.existsSync(filePath)) {
    continue;
  }
  console.log(`\n==========================================`);
  console.log(`[SEARCHING] ${filePath}`);
  console.log(`==========================================`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  for (const q of queries) {
    let pos = 0;
    let matchCount = 0;
    while ((pos = content.indexOf(q, pos)) !== -1) {
      matchCount++;
      const start = Math.max(0, pos - 150);
      const end = Math.min(content.length, pos + 150);
      console.log(`▶ [Match ${matchCount}] Keyword: "${q}" at Pos: ${pos}`);
      console.log(`Context: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
      pos += q.length;
    }
  }
}
