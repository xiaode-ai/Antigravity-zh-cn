import fs from 'fs';

const dictPath = 'translations.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const results = [];
dict.forEach((item, idx) => {
  if (item.old.includes('Go to Projects') || item.old.includes('value:"Go to Projects"')) {
    results.push({ index: idx, old: item.old, new: item.new });
  }
});

console.log(JSON.stringify(results, null, 2));
