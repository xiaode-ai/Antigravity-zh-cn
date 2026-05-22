import fs from 'fs';
import path from 'path';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log(`mainContent length: ${mainContent.length}`);
console.log(`wbContent length: ${wbContent.length}`);

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

function locate(content, name) {
  console.log(`\n=================== LOCATING IN ${name} ===================`);
  if (!content) {
    console.log(`File ${name} not found!`);
    return;
  }
  searchPhrases.forEach(phrase => {
    let index = 0;
    let foundCount = 0;
    while (true) {
      const idx = content.indexOf(phrase, index);
      if (idx === -1) break;
      foundCount++;
      if (foundCount <= 10) { // Limit matches per phrase to avoid excessive output
        const contextStart = Math.max(0, idx - 80);
        const contextEnd = Math.min(content.length, idx + phrase.length + 80);
        console.log(`[${phrase}] Match ${foundCount} at index ${idx}:`);
        console.log(`   ...${content.substring(contextStart, contextEnd).replace(/\n/g, ' ')}...`);
      }
      index = idx + 1;
    }
    if (foundCount > 10) {
      console.log(`[${phrase}] ... and ${foundCount - 10} more matches.`);
    } else if (foundCount === 0) {
      console.log(`[${phrase}] No matches found.`);
    }
  });
}

locate(mainContent, 'main.js');
locate(wbContent, 'workbench');
