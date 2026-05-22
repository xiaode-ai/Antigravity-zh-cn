import fs from 'fs';
import path from 'path';

const resultsPath = path.join(process.cwd(), 'scratch', 'search_results.txt');
const outputPath = path.join(process.cwd(), 'scratch', 'summary_matches.txt');

if (!fs.existsSync(resultsPath)) {
  console.error(`Results file not found at: ${resultsPath}`);
  process.exit(1);
}

const content = fs.readFileSync(resultsPath, 'utf8');
const lines = content.split('\n');

const targetTerms = [
  'Limited time',
  'Fast',
  'Settings',
  'Antigravity - Settings',
  'Open Antigravity IDE User Settings'
];

let currentFile = '';
let matchInfo = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('=================== FILE:')) {
    currentFile = line;
  }
  
  const hasTerm = targetTerms.some(term => line.includes(`Term: "${term}"`));
  if (hasTerm) {
    // Extract file header if not already added in this context
    matchInfo.push(`\nFile: ${currentFile}`);
    matchInfo.push(line);
    // Add next 2 lines (which usually contain Context)
    if (i + 1 < lines.length) matchInfo.push(lines[i + 1]);
    if (i + 2 < lines.length) matchInfo.push(lines[i + 2]);
  }
}

fs.writeFileSync(outputPath, matchInfo.join('\n'), 'utf8');
console.log(`[OK] Extracted summary matches to scratch/summary_matches.txt`);
