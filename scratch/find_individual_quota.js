import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function search(content, name, term) {
  console.log(`\nSearching for "${term}" in ${name}...`);
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.toLowerCase().indexOf(term.toLowerCase(), idx);
    if (idx === -1) break;
    count++;
    console.log(`Match ${count} at index ${idx}:`);
    console.log(`...${content.substring(idx - 60, idx + 100).replace(/\n/g, ' ')}...`);
    idx += term.length;
  }
}

search(mainContent, 'main.js', 'individual');
search(wbContent, 'workbench', 'individual');

search(mainContent, 'main.js', 'quota');
search(wbContent, 'workbench', 'quota');
