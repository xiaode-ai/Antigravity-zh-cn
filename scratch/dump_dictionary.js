import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (entry) {
  const content = entry.new;
  const match = content.match(/const dictionary = (\{.*?\});/);
  if (match) {
    const dictStr = match[1];
    // 使用 new Function 来解析，避免用 JSON.parse 因为它含有转义
    const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\')}`)();
    fs.writeFileSync('scratch/current_dict.json', JSON.stringify(dict, null, 2), 'utf8');
    console.log('Successfully dumped dictionary keys to scratch/current_dict.json. Total keys:', Object.keys(dict).length);
  } else {
    console.log('No dictionary declaration found');
  }
} else {
  console.log('No injection entry found');
}
