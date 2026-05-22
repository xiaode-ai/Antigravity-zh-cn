import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const regexes = [
  /\bOne\s*=\s*\{/,
  /var\s+One\s*=\s*/,
  /const\s+One\s*=\s*/
];

regexes.forEach(regex => {
  const match = regex.exec(content);
  if (match) {
    console.log(`Found match for regex ${regex} at index ${match.index}:`);
    console.log(content.substring(match.index - 100, match.index + 800));
  }
});
