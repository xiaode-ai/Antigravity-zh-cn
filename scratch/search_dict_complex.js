import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const keywords = ['Files', 'Directories', 'Code Context', 'Agent', 'Limited', 'Fast', 'Docs', 'Settings', 'Quick'];

keywords.forEach(kw => {
  const matches = dict.filter(item => item.old.includes(kw) || item.new.includes(kw));
  console.log(`Keyword "${kw}": found ${matches.length} matches in translations.json.`);
  if (matches.length > 0) {
    console.log(`  First match: old: "${matches[0].old.substring(0, 100)}", new: "${matches[0].new.substring(0, 100)}"`);
  }
});
