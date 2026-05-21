import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const terms = [
  'AI may make mistakes. Double-check all generated code.',
  'Record Audio',
  'Stop Recording',
  'Media',
  'Mentions',
  'Limited time',
  'Open Browser (Preview)'
];

function searchInFile(filePath, name) {
  if (!fs.existsSync(filePath)) {
    console.log(`[File Not Found] ${name}`);
    return;
  }
  console.log(`\n================ Searching in ${name} ================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  terms.forEach(term => {
    let idx = 0;
    let occurrences = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      occurrences++;
      console.log(`Term: "${term}" (Occur ${occurrences}) at index ${idx}`);
      console.log(`Context: ... ${content.substring(Math.max(0, idx - 60), Math.min(content.length, idx + term.length + 80)).replace(/\r?\n/g, ' ')} ...`);
      idx += term.length;
    }
  });
}

searchInFile(wbPath, 'workbench.desktop.main.js.bak');
searchInFile(mainPath, 'jetskiAgent/main.js.bak');
