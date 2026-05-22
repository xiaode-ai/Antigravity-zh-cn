import fs from 'fs';

const dictPath = 'translations.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log(JSON.stringify(dict[27], null, 2));
