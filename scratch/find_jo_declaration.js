import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Let's search for the pattern "({settingKey:"
let idx = 0;
while (true) {
  idx = bakContent.indexOf('({settingKey:', idx);
  if (idx === -1) break;
  console.log(`\nFound ({settingKey: at index ${idx}:`);
  console.log(bakContent.substring(idx - 100, idx + 800));
  idx += 13;
}

// Also let's search for "JO=" (case-sensitive) or the function that takes settingKey and has a dropdown or switch in it
// Or we can search for the definition of "JO" by using a regex: \bJO\s*=\s*
const regex = /\bJO\s*=\s*/;
const match = bakContent.match(regex);
if (match) {
  console.log('Regex found JO= match:', match.index);
  console.log(bakContent.substring(match.index - 100, match.index + 800));
} else {
  console.log('Regex \\bJO\\s*=\\s* not matched');
}
