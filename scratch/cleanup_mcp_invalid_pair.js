import fs from 'fs';

const translationsPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// Filter out the invalid pair
const filtered = translations.filter(t => t.old !== 'children:"No servers found."');

if (filtered.length < translations.length) {
  fs.writeFileSync(translationsPath, JSON.stringify(filtered, null, 2), 'utf8');
  console.log('Successfully removed the invalid "No servers found." pair.');
} else {
  console.log('Target invalid pair not found in translations.json.');
}
