import fs from 'fs';
import path from 'path';

const translationsPath = 'c:/Users/i-cgh/Documents/GitHub/antigravity-l10n/translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// 打印最后 20 个条目的 old 和 new
console.log("=== Last 20 translations ===");
translations.slice(-20).forEach((t, i) => {
  console.log(`[${i}] old:`, JSON.stringify(t.old));
  console.log(`    new:`, JSON.stringify(t.new));
});
