import fs from 'fs';
import path from 'path';

const analysisPath = path.join(process.cwd(), 'scratch', 'exact_12_terms_analysis.txt');
if (!fs.existsSync(analysisPath)) {
  console.error('File not found:', analysisPath);
  process.exit(1);
}

const content = fs.readFileSync(analysisPath, 'utf8');
const lines = content.split(/\r?\n/);

let currentFile = 'unknown';
const summary = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('=== FILE:')) {
    currentFile = line.replace(/={2,}/g, '').trim();
    summary[currentFile] = {};
    continue;
  }
  
  if (line.includes('▶ Term:')) {
    const match = line.match(/Term:\s*"([^"]+)"/);
    if (match) {
      const term = match[1];
      if (!summary[currentFile][term]) {
        summary[currentFile][term] = { count: 0, samples: [] };
      }
      summary[currentFile][term].count++;
      
      // Look at the next line for context
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.includes('Context:')) {
        const contextStr = nextLine.replace('Context: ...', '').trim();
        if (summary[currentFile][term].samples.length < 2) {
          summary[currentFile][term].samples.push(contextStr.substring(0, 100));
        }
      } else if (nextLine && nextLine.includes('Index:')) {
        // For NLS files
        const indexVal = nextLine.trim();
        const valueLine = lines[i + 2];
        const valueStr = valueLine ? valueLine.trim() : '';
        if (summary[currentFile][term].samples.length < 5) {
          summary[currentFile][term].samples.push(`${indexVal} -> ${valueStr}`);
        }
      }
    }
  }
}

// Print the summarized report
console.log('=== SEARCH SUMMARY OF THE 12 TARGET TERMS ===');
for (const [file, terms] of Object.entries(summary)) {
  console.log(`\nFile: ${file}`);
  for (const [term, data] of Object.entries(terms)) {
    console.log(`  - Term: "${term}" (Matched: ${data.count} times)`);
    data.samples.forEach(sample => {
      console.log(`      Sample: ${sample}`);
    });
  }
}
