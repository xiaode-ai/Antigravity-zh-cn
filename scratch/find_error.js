import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

function searchAndPrint(query, contextSize = 200) {
  console.log(`\nSearching for: "${query}"`);
  let idx = -1;
  let count = 0;
  while ((idx = content.indexOf(query, idx + 1)) !== -1) {
    count++;
    console.log(`Match ${count} found at index ${idx}:`);
    const start = Math.max(0, idx - contextSize);
    const end = Math.min(content.length, idx + query.length + contextSize);
    console.log(content.substring(start, end));
  }
  if (count === 0) {
    console.log('No matches found.');
  }
}

searchAndPrint('archiveConversation');
