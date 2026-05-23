import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const lastFive = dict.slice(-10);
console.log(JSON.stringify(lastFive, null, 2));
