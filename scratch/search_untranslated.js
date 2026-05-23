import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupSuffix = '.bak';

const mainBackupPath = targetFilePath + backupSuffix;
const workbenchBackupPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js') + backupSuffix;
const extensionBackupPath = path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js') + backupSuffix;
const mainProcessBackupPath = path.join(path.dirname(targetFilePath), '..', 'main.js') + backupSuffix;

const terms = [
  'listDirectory',
  'Listed directory',
  'Files Changed',
  'Export Artifact'
];

const files = {
  'jetskiAgent/main.js': mainBackupPath,
  'workbench.desktop.main.js': workbenchBackupPath,
  'extension.js': extensionBackupPath,
  'out/main.js': mainProcessBackupPath
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
      console.log(`  ▶ Found "${term}" at Index: ${index}`);
      console.log(`    Context: ... ${snippet} ...`);
    }
  }
}
