import fs from 'fs';

const content = fs.readFileSync('scratch/specific_targets_results.txt', 'utf8');
const lines = content.split('\n');

let currentFile = '';
console.log('--- Inspecting Targets ---');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('Searching in ')) {
    currentFile = line;
    console.log('\n' + line);
  }
  if (line.startsWith('--- Target:')) {
    console.log('  ' + line);
  }
  if (line.includes('Match #')) {
    // Only print matches if they are not too common, or print the first few
    const matchNum = parseInt(line.match(/Match #(\d+)/)?.[1] || '0');
    if (matchNum <= 5) {
      console.log('    ' + line.substring(0, 150) + '...');
    } else if (matchNum === 6) {
      console.log('    ...');
    }
  }
}
