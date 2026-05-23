import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupSuffix = '.bak';

const mainBackupPath = targetFilePath + backupSuffix;
const workbenchBackupPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js') + backupSuffix;

const terms = [
  'finished',
  'Finished'
];

const files = {
  'jetskiAgent/main.js': mainBackupPath,
  'workbench.desktop.main.js': workbenchBackupPath
};

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================ Searching ${name} ================`);
  for (const term of terms) {
    let index = -1;
    while ((index = content.indexOf(term, index + 1)) !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(content.length, index + term.length + 50);
      const snippet = content.substring(start, end).replace(/\n/g, ' ');
      // Filter out code words like 'finished =', '.finished', etc.
      if (snippet.includes(`"${term}"`) || snippet.includes(`'${term}'`) || snippet.includes(`\`${term}\``) || snippet.includes(`>${term}<`)) {
        console.log(`  ▶ Found "${term}" at Index: ${index}`);
        console.log(`    Context: ... ${snippet} ...`);
      }
    }
  }
}
