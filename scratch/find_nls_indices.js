import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

const searchTerms = [
  'Limited time',
  'Limited Time',
  'limited time',
  'Fast',
  'Antigravity - Settings',
  'Settings',
  'Agent',
  'Files',
  'Directories',
  'Code Context Items',
  'Docs',
  'Report Issue',
  'Changelog',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel'
];

if (!fs.existsSync(nlsPath)) {
  console.error(`Backup NLS file not found at: ${nlsPath}`);
  process.exit(1);
}

try {
  const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  console.log(`Successfully loaded NLS data. Total items: ${nlsData.length}`);

  searchTerms.forEach(term => {
    console.log(`\n================ Searching for: "${term}" ================`);
    let exactMatches = [];
    let partialMatches = [];

    nlsData.forEach((val, idx) => {
      if (typeof val === 'string') {
        if (val === term) {
          exactMatches.push({ index: idx, value: val });
        } else if (val.toLowerCase().includes(term.toLowerCase())) {
          partialMatches.push({ index: idx, value: val });
        }
      }
    });

    console.log(`Exact Matches (${exactMatches.length}):`);
    exactMatches.forEach(m => console.log(`  - Index ${m.index}: "${m.value}"`));

    console.log(`Partial Matches (showing up to 10 of ${partialMatches.length}):`);
    partialMatches.slice(0, 10).forEach(m => console.log(`  - Index ${m.index}: "${m.value}"`));
  });
} catch (err) {
  console.error(`Error processing NLS indices: ${err.message}`);
}
