import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');

if (entry) {
  let content = entry.new;
  const match = content.match(/const dictionary = (\{.*?\});/);
  if (match) {
    const dictStr = match[1];
    const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\')}`)();
    const keys = Object.keys(dict);
    const filtered = keys.filter(k => 
      k.startsWith('Retrieve') || 
      k.startsWith('Analyzes') || 
      k.startsWith('Orchestrates') || 
      k.startsWith('Query')
    );
    console.log('Matching keys in dictionary:');
    filtered.forEach(k => console.log(`  "${k}" -> "${dict[k]}"`));
  } else {
    console.log('No dictionary declaration found');
  }
} else {
  console.log('No injection entry found');
}
