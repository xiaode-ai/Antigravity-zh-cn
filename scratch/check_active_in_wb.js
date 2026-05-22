import fs from 'fs';
import path from 'path';

const rootPath = 'c:/Users/i-cgh/Documents/GitHub/antigravity-l10n';
const configPath = path.join(rootPath, 'config.json');
const translationsPath = path.join(rootPath, 'translations.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const targetFilePath = config.targetFilePath;
const backupSuffix = config.backupSuffix || '.bak';
const mainBackupPath = targetFilePath + backupSuffix;
const wbPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js');
const wbBackupPath = wbPath + backupSuffix;

if (!fs.existsSync(mainBackupPath)) {
  console.error(`Main backup file not found at: ${mainBackupPath}`);
  process.exit(1);
}

if (!fs.existsSync(wbBackupPath)) {
  console.error(`Workbench backup file not found at: ${wbBackupPath}`);
  process.exit(1);
}

const mainContent = fs.readFileSync(mainBackupPath, 'utf8');
const wbContent = fs.readFileSync(wbBackupPath, 'utf8');

const unappliedAbsolute = [];
translations.forEach(pair => {
  const inMain = mainContent.includes(pair.old);
  const inWb = wbContent.includes(pair.old);
  if (!inMain && !inWb) {
    unappliedAbsolute.push(pair);
  } else if (!inMain && inWb) {
    console.log(`[WB-ONLY] found in workbench only: "${pair.old.substring(0, 60)}..."`);
  }
});

console.log(`Total translations: ${translations.length}`);
console.log(`Unapplied in both: ${unappliedAbsolute.length}`);
