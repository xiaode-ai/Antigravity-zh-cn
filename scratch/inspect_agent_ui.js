import fs from 'fs';

const data = fs.readFileSync('scratch/locate_user_request_results.txt', 'utf8');
const lines = data.split('\n');

let capturing = false;
let currentTerm = '';

lines.forEach(line => {
  if (line.includes('==================== SEARCHING IN workbench.desktop.main.js')) {
    capturing = true;
    return;
  }
  if (line.includes('==================== SEARCHING IN extension.js')) {
    capturing = false;
    return;
  }
  
  if (!capturing) return;
  
  const termHeader = line.match(/^--- Term: "(.+)"/);
  if (termHeader) {
    const term = termHeader[1];
    if (term === 'Snooze' || term === 'Start' || term === 'Manage') {
      currentTerm = term;
      console.log(`\n\x1b[35m=== ${line} ===\x1b[0m`);
    } else {
      currentTerm = '';
    }
    return;
  }
  
  if (currentTerm && (line.startsWith('[') || line.startsWith('   ...'))) {
    // 过滤出像是 UI 结构的行
    if (line.includes('children') || line.includes('label') || line.includes('title') || line.includes('textContent') || line.includes('button')) {
      console.log(line);
    }
  }
});
