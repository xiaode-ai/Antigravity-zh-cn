import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

function scanFile(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  console.log(`\n\n==================== SCANNING ${fileName} ====================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const searchTerms = [
    'Close Agent View',
    'Past Conversations',
    'Additional Options',
    'AI may make mistakes. Double-check all generated code.',
    'Record Audio',
    'Stop Recording',
    'label:"Media"',
    'label:"Mentions"',
    'title:{value:"Agent"',
    'name:{value:"Agent"',
    '"Agent"'
  ];

  searchTerms.forEach(term => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      count++;
      console.log(`\n  ▶ Term: "${term}" (Occur #${count}, Index: ${idx})`);
      const start = Math.max(0, idx - 120);
      const end = Math.min(content.length, idx + term.length + 150);
      console.log(`    Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      idx += term.length;
    }
  });
}

scanFile(wbPath, 'workbench.desktop.main.js.bak');
scanFile(mainPath, 'jetskiAgent/main.js.bak');
