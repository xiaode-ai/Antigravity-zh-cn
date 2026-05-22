import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

const query = 'web:["page","pages"]';

function findExactPattern(content, name, pat) {
  if (!content) return;
  const idx = content.indexOf(pat);
  if (idx !== -1) {
    console.log(`Found "${pat}" in ${name} at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + pat.length + 100));
  } else {
    // Search for a broader pattern like 'pages'
    console.log(`"${pat}" not found in ${name}. Searching for 'folders:["' or similar`);
    const filesIdx = content.indexOf('folders:["folder"');
    if (filesIdx !== -1) {
      console.log(`Found folders in ${name} at ${filesIdx}:`);
      console.log(content.substring(filesIdx - 100, filesIdx + 300));
    }
  }
}

findExactPattern(mainContent, 'main.js.bak', query);
findExactPattern(wbContent, 'workbench.desktop.main.js.bak', query);
