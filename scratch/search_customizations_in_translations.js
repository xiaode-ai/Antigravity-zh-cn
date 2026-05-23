import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const matches = translations.filter(m => m.old.includes('Customizations') || m.new.includes('Customizations'));
console.log(JSON.stringify(matches, null, 2));
