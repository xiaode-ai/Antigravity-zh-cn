import fs from 'fs';
import path from 'path';

const rootPath = 'c:/Users/i-cgh/Documents/GitHub/Antigravity-zh-cn';
const translationsPath = path.join(rootPath, 'translations.json');

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');

if (!entry) {
  console.error('DOM injection entry not found');
  process.exit(1);
}

const match = entry.new.match(/executeJavaScript\("([\s\S]*?)"\)/);
if (!match) {
  console.error('executeJavaScript code not found');
  process.exit(1);
}

let rawJS = match[1]
  .replace(/\\"/g, '"')
  .replace(/\\'/g, "'")
  .replace(/\\\\/g, '\\')
  .replace(/\\n/g, '\n');

fs.writeFileSync('scratch/iife_extracted.js', rawJS, 'utf8');
console.log('Successfully wrote raw JS to scratch/iife_extracted.js');
