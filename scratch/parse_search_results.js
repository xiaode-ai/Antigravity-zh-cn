import fs from 'fs';
import path from 'path';

const logPath = 'scratch/search_results.txt';
if (!fs.existsSync(logPath)) {
  console.log('Log file not found!');
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

const matchedLines = [];
let currentFile = '';

lines.forEach(line => {
  if (line.includes('=== LOCATING IN')) {
    matchedLines.push('\n' + line);
    currentFile = line;
  }
  // If line contains bracketed phrase like [Fast] or [Analyzed] etc.
  if (line.startsWith('[') && line.includes('] Match')) {
    matchedLines.push(line);
  }
  if (line.startsWith('   ...')) {
    // If the previous line was a match, keep the context
    matchedLines.push(line);
  }
  if (line.includes('No matches found')) {
    matchedLines.push(line);
  }
});

fs.writeFileSync('scratch/filtered_matches.txt', matchedLines.join('\n'), 'utf8');
console.log('Done! Filtered matches written to scratch/filtered_matches.txt');
