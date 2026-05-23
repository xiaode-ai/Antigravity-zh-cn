import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = {
  mainBak: path.join(outDir, 'jetskiAgent', 'main.js.bak'),
  mainCur: path.join(outDir, 'jetskiAgent', 'main.js'),
  wbBak: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'),
  wbCur: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js')
};

const outputLines = [];

function log(msg) {
  outputLines.push(msg);
}

function findMatches(filePath, term, fileLabel) {
  if (!fs.existsSync(filePath)) {
    log(`File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  let index = 0;
  let count = 0;
  
  log(`\n=================== Matches for "${term}" in ${fileLabel} ===================`);
  while (true) {
    index = content.indexOf(term, index);
    if (index === -1) break;
    count++;
    
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + term.length + 150);
    const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
    log(`  [Match ${count}] Pos: ${index}`);
    log(`  Snippet: ... ${snippet} ...`);
    
    index += term.length;
  }
  if (count === 0) {
    log(`  No matches found.`);
  }
}

// Check "Accept Changes"
findMatches(files.wbBak, "Accept Changes", "workbench.desktop.main.js.bak");
findMatches(files.wbCur, "Accept Changes", "workbench.desktop.main.js");

// Check "Searched"
findMatches(files.wbBak, "Searched", "workbench.desktop.main.js.bak");
findMatches(files.wbCur, "Searched", "workbench.desktop.main.js");
findMatches(files.mainBak, "Searched", "jetskiAgent/main.js.bak");
findMatches(files.mainCur, "Searched", "jetskiAgent/main.js");

// Check "edited file"
findMatches(files.wbBak, "edited file", "workbench.desktop.main.js.bak");
findMatches(files.wbCur, "edited file", "workbench.desktop.main.js");
findMatches(files.mainBak, "edited file", "jetskiAgent/main.js.bak");
findMatches(files.mainCur, "edited file", "jetskiAgent/main.js");

fs.writeFileSync('scratch/diagnose_output.txt', outputLines.join('\n'), 'utf8');
console.log('Diagnostic finished. Written to scratch/diagnose_output.txt');
