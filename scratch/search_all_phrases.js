import fs from 'fs';
import path from 'path';

const mainJsBak = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const workbenchJs = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';

const phrases = [
  "Fast",
  "Analyzed",
  "Edited",
  "Ran",
  "Working",
  "Changes Overview",
  "Files With Changes",
  "Background Processes Running",
  "Files for Conversation",
  "Reject all",
  "Browser",
  "Ask anything",
  "Your plan's baseline quota",
  "Enable Overages",
  "See plans",
  "minutes ago",
  "View conversation",
  "Copy to clipboard",
  "Export artifact",
  "Submit comment",
  "Add a message",
  "Select text in the artifact",
  "Proceed",
  "Proceed with implementation plan",
  "Implementation Plan",
  "Individual quota reached",
  "task",
  "Send Queued Message",
  "cancel",
  "Timed 60 seconds",
  "Walkthrough",
  "Customization"
];

let output = '';
function log(msg) {
  output += msg + '\n';
}

function searchInFile(filePath, name) {
  if (!fs.existsSync(filePath)) {
    log(`[NOT FOUND] File ${name} at ${filePath}`);
    return;
  }
  log(`\n=================== SEARCHING IN ${name} ===================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  phrases.forEach(phrase => {
    let idx = -1;
    let occurrences = 0;
    while (true) {
      idx = content.indexOf(phrase, idx + 1);
      if (idx === -1) break;
      occurrences++;
      if (occurrences <= 15) {
        const start = Math.max(0, idx - 100);
        const end = Math.min(content.length, idx + phrase.length + 150);
        const snippet = content.substring(start, end).replace(/\n/g, '\\n');
        log(`[FOUND] "${phrase}" in ${name} at index ${idx}:\n  ...${snippet}...`);
      }
    }
    if (occurrences > 0) {
      log(`--> Total occurrences of "${phrase}" in ${name}: ${occurrences}\n`);
    } else {
      log(`--> "${phrase}" NOT found in ${name}.\n`);
    }
  });
}

searchInFile(mainJsBak, 'main.js.bak');
searchInFile(workbenchJs, 'workbench.desktop.main.js');

fs.writeFileSync('scratch/search_results.txt', output, 'utf8');
console.log('Search done! Output written to scratch/search_results.txt');
