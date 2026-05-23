import fs from 'fs';
import path from 'path';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';
const normalExtPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

const extFile = fs.existsSync(extPath) ? extPath : normalExtPath;
console.log('Reading from:', extFile);
if (!fs.existsSync(extFile)) {
  console.log('extension.js does not exist.');
  process.exit(0);
}
const content = fs.readFileSync(extFile, 'utf8');

const searchTerms = [
  'openPluginPage',
  'openPluginConfigModal',
  'mcpStateProvider',
  'MCP Store',
  'trustLevel'
];

searchTerms.forEach(term => {
  let index = 0;
  console.log(`\n\n==================== SEARCHING FOR ${term} ====================`);
  let count = 0;
  while (true) {
    const idx = content.indexOf(term, index);
    if (idx === -1) break;
    count++;
    console.log(`Match #${count} at Index ${idx}:`);
    const start = Math.max(0, idx - 500);
    const end = Math.min(content.length, idx + term.length + 500);
    console.log(content.substring(start, end));
    index = idx + term.length;
    if (count >= 5) {
      console.log('... truncated matches');
      break;
    }
  }
});
