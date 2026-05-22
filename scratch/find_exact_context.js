import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

const searchTerms = [
  "Fast",
  "Analyzed",
  "Edited",
  "Ran",
  "Working",
  "Changes Overview",
  "File With Changes",
  "Files With Changes",
  "Terminal",
  "Background Process",
  "Background Processes",
  "Artifacts",
  "Files for Conversation",
  "Reject all",
  "Reject All",
  "Browser",
  "Ask anything",
  "Your plan's baseline quota",
  "Google AI Ultra plan",
  "Enable Overages",
  "See plans.",
  "See Plans",
  "ago",
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

const results = [];

function search(content, name, terms) {
  results.push(`\n\n==================== SEARCHING IN ${name} ====================`);
  terms.forEach(term => {
    let index = 0;
    let occurrences = [];
    while (true) {
      const idx = content.indexOf(term, index);
      if (idx === -1) break;
      occurrences.push(idx);
      index = idx + 1;
    }
    
    results.push(`\n--- Term: "${term}" (Total Found: ${occurrences.length}) ---`);
    occurrences.slice(0, 15).forEach((idx, count) => {
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      results.push(`[${term}] Occur #${count + 1} at Index ${idx}:`);
      results.push(`   ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    });
    if (occurrences.length > 15) {
      results.push(`   ... and ${occurrences.length - 15} more matches`);
    }
  });
}

search(mainContent, 'main.js.bak', searchTerms);
search(wbContent, 'workbench.desktop.main.js.bak', searchTerms);

fs.writeFileSync('scratch/search_results.txt', results.join('\n'), 'utf8');
console.log('Search completed. Results written to scratch/search_results.txt');
