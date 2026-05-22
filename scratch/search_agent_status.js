import fs from 'fs';
import path from 'path';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const searchPhrases = [
  "Fast",
  "Analyzed",
  "Ran",
  "Working",
  "Browser",
  "Ask anything",
  "Export artifact",
  "Copy to clipboard",
  "View conversation",
  "Submit comment",
  "Add a message",
  "Select text in the artifact to add a comment",
  "Timed 60 seconds"
];

function locate(content, filename) {
  console.log(`\n=================== LOCATING IN ${filename} ===================`);
  if (!content) {
    console.log(`File not found: ${filename}`);
    return;
  }
  searchPhrases.forEach(phrase => {
    let index = 0;
    let foundCount = 0;
    while (true) {
      const idx = content.indexOf(phrase, index);
      if (idx === -1) break;
      foundCount++;
      const contextStart = Math.max(0, idx - 100);
      const contextEnd = Math.min(content.length, idx + phrase.length + 150);
      console.log(`[${phrase}] Match ${foundCount} at index ${idx}:`);
      console.log(`   ...${content.substring(contextStart, contextEnd).replace(/\n/g, ' ')}...`);
      index = idx + 1;
    }
    if (foundCount === 0) {
      console.log(`[${phrase}] No matches found.`);
    }
  });
}

locate(mainContent, 'main.js');
locate(wbContent, 'workbench');
