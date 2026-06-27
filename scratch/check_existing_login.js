import fs from 'fs';
import path from 'path';

const rootPath = 'c:/Users/i-cgh/Documents/GitHub/Antigravity-zh-cn';
const translationsPath = path.join(rootPath, 'translations.json');

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const domEntry = translations.find((p) => p.old === 'void win.loadURL(url);');

const dictStartMarker = 'const dictionary = {';
const dictStartIdx = domEntry.new.indexOf(dictStartMarker);
const dictEndIdx = domEntry.new.indexOf('};', dictStartIdx);

const dictBody = domEntry.new.substring(dictStartIdx + dictStartMarker.length, dictEndIdx);
const jsonStr = '{' + dictBody.replace(/\\"/g, '"').replace(/\\\\/g, '\\') + '}';
const dictObj = JSON.parse(jsonStr);

const checkKeys = [
  'welcome to antigravity',
  'continue with google',
  'use google cloud project instead',
  'awaiting authentication',
  'previous',
  'open ide',
  'open in antigravity ide',
  'pin',
  'copy conversation name',
  'copy conversation id',
  'copy workspace name',
  'copy project name'
];

for (const k of Object.keys(dictObj)) {
  for (const ck of checkKeys) {
    if (k.toLowerCase() === ck) {
      console.log(`Exact match: "${k}": "${dictObj[k]}"`);
    } else if (k.toLowerCase().includes(ck)) {
      console.log(`Partial match: "${k}": "${dictObj[k]}"`);
    }
  }
}
