import fs from 'fs';

const data = fs.readFileSync('scratch/locate_user_request_results.txt', 'utf8');

const lines = data.split('\n');
let currentFile = '';
const fileResults = {};

lines.forEach(line => {
  if (line.includes('==================== SEARCHING IN')) {
    currentFile = line.split('SEARCHING IN ')[1].replace(/ =+/, '').trim();
    fileResults[currentFile] = [];
  }
  
  const termMatch = line.match(/^--- Term: "(.+)" \(Total Found: (\d+)\) ---/);
  if (termMatch && currentFile) {
    const term = termMatch[1];
    const count = parseInt(termMatch[2], 10);
    if (count > 0) {
      fileResults[currentFile].push({ term, count });
    }
  }
});

console.log('--- FOUND TERMS SUMMARY ---');
for (const file in fileResults) {
  console.log(`\nFile: ${file}`);
  fileResults[file].sort((a, b) => a.count - b.count).forEach(item => {
    console.log(`  - "${item.term}": found ${item.count} times`);
  });
}
