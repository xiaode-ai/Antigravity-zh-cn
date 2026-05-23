import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const extensionDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist';

const files = {
  mainBak: path.join(outDir, 'jetskiAgent', 'main.js.bak'),
  mainCur: path.join(outDir, 'jetskiAgent', 'main.js'),
  wbBak: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'),
  wbCur: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js'),
  extBak: path.join(extensionDir, 'extension.js.bak'),
  extCur: path.join(extensionDir, 'extension.js')
};

function printMatches(filePath, term, label) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let index = 0;
  let count = 0;
  console.log(`\n=== Matches for "${term}" in ${label} ===`);
  while (true) {
    index = content.indexOf(term, index);
    if (index === -1) break;
    count++;
    
    // Print 80 chars before and 120 chars after
    const start = Math.max(0, index - 80);
    const end = Math.min(content.length, index + term.length + 120);
    const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`  [Match ${count}] Pos: ${index} | Context: ... ${snippet} ...`);
    index += term.length;
  }
  if (count === 0) {
    console.log("  None found.");
  }
}

// 1. "Accept Changes" remaining in workbench (current)
printMatches(files.wbCur, "Accept Changes", "workbench.desktop.main.js (current)");
printMatches(files.wbBak, "Accept Changes", "workbench.desktop.main.js (bak)");

// 2. "Searched" remaining in workbench (current) and main (current)
printMatches(files.wbCur, "Searched", "workbench.desktop.main.js (current)");
printMatches(files.mainCur, "Searched", "jetskiAgent/main.js (current)");

// 3. Search for variations of "edited file" or "Edited files" or "View" + "edited"
printMatches(files.wbBak, "edited file", "workbench.desktop.main.js (bak)");
printMatches(files.mainBak, "edited file", "jetskiAgent/main.js (bak)");
printMatches(files.wbBak, "editedFile", "workbench.desktop.main.js (bak)");
printMatches(files.mainBak, "editedFile", "jetskiAgent/main.js (bak)");
printMatches(files.wbBak, "Edited", "workbench.desktop.main.js (bak)");

