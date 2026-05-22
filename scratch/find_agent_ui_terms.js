import fs from 'fs';
import path from 'path';

const analysisPath = path.join(process.cwd(), 'scratch', 'exact_12_terms_analysis.txt');
const content = fs.readFileSync(analysisPath, 'utf8');
const lines = content.split(/\r?\n/);

let currentFile = '';
const targets = ['Files', 'Directories', 'Code Context Items', 'Agent'];

console.log('=== UI TERMS SEARCH DETAILS ===');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('=== FILE:')) {
    currentFile = line.replace(/={2,}/g, '').trim();
    continue;
  }
  
  if (line.includes('▶ Term:')) {
    const match = line.match(/Term:\s*"([^"]+)"/);
    if (match) {
      const term = match[1];
      if (targets.includes(term)) {
        // If it is Agent or Files, we only print a few interesting ones or if they are in main.js
        if (currentFile.includes('main.js')) {
          const nextLine = lines[i + 1];
          const context = nextLine ? nextLine.replace('Context: ...', '').trim() : '';
          
          // Let's filter to keep only UI string literals, e.g. "Files" or similar
          if (term === 'Agent' && !context.includes('children:')) {
             continue; // Skip non-UI occurrences of Agent
          }
          if (term === 'Files' && !context.includes('Files') && !context.includes('children')) {
             continue;
          }
          
          console.log(`[${currentFile}] Term: "${term}"`);
          console.log(`  Context: ${context}`);
          console.log('');
        }
      }
    }
  }
}
