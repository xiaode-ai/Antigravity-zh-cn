import fs from 'fs';

const data = fs.readFileSync('scratch/locate_user_request_results.txt', 'utf8');
const lines = data.split('\n');

let capturing = false;
let currentTerm = '';
const termsToPrint = [
  "Back to Agent",
  "Customize Agent to get a better, more personalized experience.",
  "Rules help guide the behavior of Agent.",
  "Workflows are saved prompts that Agent can follow. To trigger a workflow, type \"/\" in Agent.",
  "Advanced Settings",
  "help perform",
  "Last Updated",
  "Open Command",
  "Open Agent",
  "View all Antigravity IDE shortcuts",
  "Reset to default shortcuts",
  "Background Processes Running",
  "helpperform"
];

let termLogged = false;

lines.forEach(line => {
  if (line.includes('==================== SEARCHING IN workbench.desktop.main.js')) {
    capturing = true;
    console.log('\n======================================================');
    console.log('=== MATCHES IN workbench.desktop.main.js ===');
    console.log('======================================================');
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
    if (termsToPrint.includes(term)) {
      currentTerm = term;
      termLogged = true;
      console.log(`\n\x1b[36m${line}\x1b[0m`);
    } else {
      currentTerm = '';
      termLogged = false;
    }
    return;
  }
  
  if (termLogged && (line.startsWith('[') || line.startsWith('   ...'))) {
    console.log(line);
  }
});
