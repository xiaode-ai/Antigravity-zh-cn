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

const originalContent = fs.readFileSync(backupPath, 'utf8');

// 按照 translate.js 中的逻辑进行排序
const sortedTranslations = [...translations].sort((a, b) => b.old.length - a.old.length);

let content = originalContent;
const results = [];

for (let i = 0; i < sortedTranslations.length; i++) {
  const pair = sortedTranslations[i];
  
  const existedInOriginal = originalContent.includes(pair.old);
  const existsInCurrent = content.includes(pair.old);
  
  if (existsInCurrent) {
    content = content.replaceAll(pair.old, pair.new);
    results.push({
      pair,
      status: 'applied',
      existedInOriginal
    });
  } else {
    results.push({
      pair,
      status: 'unapplied',
      existedInOriginal
    });
  }
}

const unapplied = results.filter(r => r.status === 'unapplied');
const applied = results.filter(r => r.status === 'applied');

console.log(`Total translations: ${sortedTranslations.length}`);
console.log(`Applied count: ${applied.length}`);
console.log(`Unapplied count: ${unapplied.length}`);

console.log('\n================ 未汉化映射诊断报告 ================');

console.log('\n类型 A: 绝对未应用 (共 ' + unapplied.filter(r => !r.existedInOriginal).length + ' 组) - 原始文件中本来就没有这些英文词条：');
unapplied.filter(r => !r.existedInOriginal).forEach((r, idx) => {
  console.log(`[A-${idx + 1}] 原文: ${JSON.stringify(r.pair.old)}`);
  console.log(`      译文: ${JSON.stringify(r.pair.new)}`);
});

console.log('\n类型 B: 覆盖式未应用 (共 ' + unapplied.filter(r => r.existedInOriginal).length + ' 组) - 原始文件中有，但由于其被包含在更长的词条中，已在前面的汉化替换中被一并翻译，轮到它时内容已被改变：');
unapplied.filter(r => r.existedInOriginal).forEach((r, idx) => {
  console.log(`[B-${idx + 1}] 原文: ${JSON.stringify(r.pair.old)}`);
  console.log(`      译文: ${JSON.stringify(r.pair.new)}`);
});
