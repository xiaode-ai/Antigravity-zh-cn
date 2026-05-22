import fs from 'fs';
import path from 'path';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const searchPhrases = [
  "Fast",
  "Analyzed",
  "Edited",
  "Ran",
  "Working",
  "Changes Overview",
  "Files With Changes",
  "File With Changes",
  "File(s) With Changes",
  "Terminal",
  "Background Process",
  "Background Processes Running",
  "Artifacts",
  "Files for Conversation",
  "Reject all",
  "Reject All",
  "Browser",
  "Ask anything",
  "Your plan's baseline quota",
  "Ultra plan to receive the highest rate limits",
  "Enable Overages",
  "See plans.",
  "See Plans",
  "minutes ago",
  "ago",
  "View conversation",
  "Copy to clipboard",
  "Export artifact",
  "Submit comment",
  "Add a message",
  "Select text in the artifact to add a comment",
  "Proceed",
  "Proceed with implementation plan",
  "Implementation Plan",
  "Individual quota reached",
  "Send Queued Message",
  "cancel",
  "Timed 60 seconds",
  "Walkthrough",
  "Customization"
];

let logContent = '';

function locate(content, filename) {
  logContent += `\n=================== LOCATING IN ${filename} ===================\n`;
  if (!content) {
    logContent += `File not found: ${filename}\n`;
    return;
  }
  searchPhrases.forEach(phrase => {
    let index = 0;
    let foundCount = 0;
    while (true) {
      const idx = content.indexOf(phrase, index);
      if (idx === -1) break;
      foundCount++;
      const contextStart = Math.max(0, idx - 120);
      const contextEnd = Math.min(content.length, idx + phrase.length + 150);
      logContent += `[${phrase}] Match ${foundCount} at index ${idx}:\n`;
      logContent += `   ...${content.substring(contextStart, contextEnd).replace(/\r?\n/g, ' ')}...\n\n`;
      index = idx + 1;
    }
    if (foundCount === 0) {
      logContent += `[${phrase}] No matches found.\n`;
    }
  });
}

locate(mainContent, 'main.js');
locate(wbContent, 'workbench');

fs.writeFileSync('scratch/search_results.txt', logContent, 'utf8');
console.log('Done! Results written to scratch/search_results.txt');
