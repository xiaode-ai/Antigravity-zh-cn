import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const extBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';
const extContent = fs.existsSync(extBakPath) ? fs.readFileSync(extBakPath, 'utf8') : '';

const searchTerms = [
  "Back to Agent",
  "Customize Agent to get a better, more personalized experience.",
  "Rules help guide the behavior of Agent.",
  "Workflows are saved prompts that Agent can follow. To trigger a workflow, type \"/\" in Agent.",
  "Workflows",
  "Advanced Settings",
  "Open Command",
  "Open Agent",
  "View all Antigravity IDE shortcuts",
  "View all",
  "Reset to default shortcuts",
  "Background Process",
  "Background Processes",
  "Last Updated",
  "help perform longer running",
  "0 pages",
  "Launch",
  "Browser",
  "Snooze",
  "Start"
];

let output = '';

function findContext(content, name, terms) {
  if (!content) {
    output += `[INFO] File ${name} is empty or doesn't exist.\n`;
    return;
  }
  output += `\n================ SEARCH IN ${name} ================\n`;
  terms.forEach(term => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      occurrences.push(idx);
      idx += term.length;
    }
    output += `- "${term}": found ${occurrences.length} times\n`;
    occurrences.forEach((pos, i) => {
      // limit printed occurrences for very common words like "Start"
      if (occurrences.length > 20 && i >= 10) return;
      const start = Math.max(0, pos - 150);
      const end = Math.min(content.length, pos + term.length + 150);
      output += `  [Match ${i+1} at ${pos}]:\n`;
      output += `    ${content.substring(start, end).replace(/\r?\n/g, ' ')}\n`;
    });
    if (occurrences.length > 20) {
      output += `  ... and ${occurrences.length - 10} more matches omitted\n`;
    }
  });
}

findContext(mainContent, 'main.js.bak', searchTerms);
findContext(wbContent, 'workbench.desktop.main.js.bak', searchTerms);
findContext(extContent, 'extension.js.bak', searchTerms);

fs.writeFileSync('scratch/user_terms_context_results.txt', output, 'utf8');
console.log('Done searching contexts! Output written to scratch/user_terms_context_results.txt');
