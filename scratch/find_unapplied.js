import fs from 'fs';
import path from 'path';

const rootPath = 'c:/Users/i-cgh/Documents/GitHub/antigravity-l10n';
const configPath = path.join(rootPath, 'config.json');
const translationsPath = path.join(rootPath, 'translations.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const targetFilePath = config.targetFilePath;
const backupSuffix = config.backupSuffix || '.bak';
const backupPath = targetFilePath + backupSuffix;

if (!fs.existsSync(backupPath)) {
  console.error(`Backup file not found at: ${backupPath}`);
  process.exit(1);
}

const backupContent = fs.readFileSync(backupPath, 'utf8');

console.log(`Total translations in dictionary: ${translations.length}`);

const unapplied = [];
const applied = [];

for (const pair of translations) {
  if (!backupContent.includes(pair.old)) {
    unapplied.push(pair);
  } else {
    applied.push(pair);
  }
}

console.log(`Applied: ${applied.length}`);
console.log(`Unapplied: ${unapplied.length}`);

console.log('\n--- Unapplied Mappings ---');
unapplied.forEach((pair, idx) => {
  console.log(`[${idx + 1}] Old: "${pair.old}"`);
  console.log(`    New: "${pair.new}"`);
});
