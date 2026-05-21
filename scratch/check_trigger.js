import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
translations.forEach((t, i) => {
  if (t.new && (t.new.includes('(Science)') || t.new.includes('(Chrome DevTools)') || t.new.includes('(Modern Web Guidance)'))) {
    console.log(`Index ${i}:`);
    console.log(JSON.stringify(t, null, 2));
  }
});




