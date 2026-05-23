import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');
const wbBakPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

function printContext(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`${label}: File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== ${label} (Total length: ${content.length}) ===`);
  
  // Find "Accept Changes" or similar around where it was found
  const term = "Accept Changes";
  let pos = content.indexOf(term);
  if (pos !== -1) {
    console.log(`Found "Accept Changes" at pos ${pos}`);
    console.log(`Context: ... ${content.substring(pos - 150, pos + term.length + 150).replace(/\r?\n/g, ' ')} ...`);
  } else {
    console.log(`"Accept Changes" NOT found!`);
  }

  // Find "Edited files" or similar around where it was found
  const term2 = "Edited files";
  let pos2 = content.indexOf(term2);
  if (pos2 !== -1) {
    console.log(`Found "Edited files" at pos ${pos2}`);
    console.log(`Context: ... ${content.substring(pos2 - 150, pos2 + term2.length + 150).replace(/\r?\n/g, ' ')} ...`);
  } else {
    console.log(`"Edited files" NOT found!`);
  }
}

printContext(wbPath, 'workbench.desktop.main.js');
printContext(wbBakPath, 'workbench.desktop.main.js.bak');
