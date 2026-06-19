import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (entry) {
  const content = entry.new;
  const idx = content.indexOf('无敌的优先');
  if (idx !== -1) {
    const slice = content.substring(idx - 10, idx + 80);
    console.log('Found slice:', JSON.stringify(slice));
    for (let i = 0; i < slice.length; i++) {
      console.log(`char[${i}]: ${JSON.stringify(slice[i])} (code: ${slice.charCodeAt(i)})`);
    }
  } else {
    console.log('Marker not found');
  }
} else {
  console.log('Entry not found');
}
