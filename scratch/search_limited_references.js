import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

function searchInFile(filePath, name, regex) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  console.log(`\n=== Matches for ${regex.toString()} in ${name} ===`);
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
    if (count > 50) {
      console.log('Too many matches, stopping...');
      break;
    }
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    console.log(`[${count}] Index ${idx}: "${match[0]}"`);
    console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
}

searchInFile(mainPath, 'jetskiAgent/main.js.bak', /["']Limited["']|["']limited["']/g);
searchInFile(mainPath, 'jetskiAgent/main.js.bak', /["']Fast["']|["']fast["']/g);

searchInFile(wbPath, 'workbench.desktop.main.js.bak', /["']Limited["']|["']limited["']/g);
searchInFile(wbPath, 'workbench.desktop.main.js.bak', /["']Fast["']|["']fast["']/g);
