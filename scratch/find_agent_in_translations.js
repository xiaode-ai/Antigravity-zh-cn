import fs from 'fs';
import path from 'path';

const transPath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\translations.json';
const translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

const matches = translations.filter(t => t.old.includes('Agent') || t.new.includes('智能体'));
console.log(`Found ${matches.length} matches for 'Agent' or '智能体' in translations.json:`);
matches.forEach((m, idx) => {
  if (idx < 20) {
    console.log(`[Match ${idx+1}]`);
    console.log(`  old: ${m.old.substring(0, 150)}`);
    console.log(`  new: ${m.new.substring(0, 150)}`);
  }
});
