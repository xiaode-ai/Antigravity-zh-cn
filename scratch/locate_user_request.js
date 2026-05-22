import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

const searchTerms = [
  "Agent",
  "Files",
  "Directories",
  "Code Context Items",
  "Limited time",
  "Limited-time",
  "limited time",
  "Fast",
  "Open Antigravity IDE User Settings",
  "Quick Settings Panel",
  "Docs",
  "Report Issue",
  "Changelog",
  "Antigravity - Settings"
];

let output = [];
function log(msg) {
  console.log(msg);
  output.push(msg);
}

function scanFile(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    log(`File not found: ${filePath}`);
    return;
  }
  log(`\n\n==================== SCANNING ${fileName} ====================`);
  const content = fs.readFileSync(filePath, 'utf8');

  searchTerms.forEach(term => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      count++;
      
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      if (term === 'Agent' && (context.includes('userAgent') || context.includes('AgentManagerServices') || context.includes('AgentSidePanelServices'))) {
        idx += term.length;
        continue;
      }
      if (term === 'Files' && (context.includes('Files.js') || context.includes('.files') || context.includes('Files('))) {
        idx += term.length;
        continue;
      }
      
      log(`\n  ▶ Term: "${term}" (Occur #${count}, Index: ${idx})`);
      log(`    Context: ... ${context} ...`);
      
      idx += term.length;
    }
  });
}

function scanNls(filePath) {
  if (!fs.existsSync(filePath)) {
    log(`File not found: ${filePath}`);
    return;
  }
  log(`\n\n==================== SCANNING NLS messages ====================`);
  try {
    const nlsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    searchTerms.forEach(term => {
      nlsData.forEach((val, idx) => {
        if (typeof val === 'string' && (val.toLowerCase() === term.toLowerCase() || val.toLowerCase().includes(term.toLowerCase()))) {
          log(`  ▶ NLS Match: "${term}" -> Index ${idx}: "${val}"`);
        }
      });
    });
  } catch (err) {
    log(`Error scanning NLS: ${err.message}`);
  }
}

scanFile(mainPath, 'jetskiAgent/main.js.bak');
scanFile(wbPath, 'workbench.desktop.main.js.bak');
scanNls(nlsPath);

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'locate_user_request_results_utf8.txt'), output.join('\n'), 'utf8');
log('\n[OK] Wrote results to scratch/locate_user_request_results_utf8.txt');
