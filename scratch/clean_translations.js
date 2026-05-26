import fs from 'fs';
import path from 'path';

const rootPath = process.cwd();
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

const originalContent = fs.readFileSync(backupPath, 'utf8');

console.log(`Original translation count: ${translations.length}`);

// 过滤出那些在备份文件中存在的词条
const activeTranslations = translations.filter(pair => {
  return originalContent.includes(pair.old);
});

console.log(`Filtered translation count: ${activeTranslations.length}`);
console.log(`Removed ${translations.length - activeTranslations.length} invalid translations.`);

fs.writeFileSync(translationsPath, JSON.stringify(activeTranslations, null, 2), 'utf8');
console.log('Cleaned translations.json saved successfully!');
