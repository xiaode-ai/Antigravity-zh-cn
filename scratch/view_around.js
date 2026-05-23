import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupSuffix = '.bak';

const workbenchBackupPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js') + backupSuffix;

if (fs.existsSync(workbenchBackupPath)) {
  const content = fs.readFileSync(workbenchBackupPath, 'utf8');
  const index = 24522973;
  const start = Math.max(0, index - 250);
  const end = Math.min(content.length, index + 250);
  console.log(content.substring(start, end));
}
