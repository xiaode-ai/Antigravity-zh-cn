import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');

const bakContent = fs.readFileSync(bakPath, 'utf8');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

// Find Match 6 in translations.json
const match6 = translations.find(t => t.old.includes('resolveOptionToString:t=>$1t.find(r=>r.value===t)?.label||"Request Review"') && !t.old.includes('[Mr.ARTIFACT_REVIEW_MODE'));

if (match6) {
  console.log('Match 6 OLD:', match6.old);
  console.log('Match 6 NEW:', match6.new);
  console.log('Exists in bakContent?', bakContent.includes(match6.old));
  console.log('Exists in mainContent?', mainContent.includes(match6.old));
  console.log('Exists mainContent (new)?', mainContent.includes(match6.new));
} else {
  console.log('Match 6 not found in translations.json');
}
