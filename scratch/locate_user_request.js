import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

// 如果没有.bak，则尝试读取没有.bak的源文件以进行只读搜索
const getMainContent = () => {
  if (fs.existsSync(mainPath)) return fs.readFileSync(mainPath, 'utf8');
  const normalPath = path.join(outDir, 'jetskiAgent', 'main.js');
  return fs.existsSync(normalPath) ? fs.readFileSync(normalPath, 'utf8') : '';
};

const getWbContent = () => {
  if (fs.existsSync(wbPath)) return fs.readFileSync(wbPath, 'utf8');
  const normalPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');
  return fs.existsSync(normalPath) ? fs.readFileSync(normalPath, 'utf8') : '';
};

const getExtContent = () => {
  if (fs.existsSync(extPath)) return fs.readFileSync(extPath, 'utf8');
  const normalPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';
  return fs.existsSync(normalPath) ? fs.readFileSync(normalPath, 'utf8') : '';
};

const mainContent = getMainContent();
const wbContent = getWbContent();
const extContent = getExtContent();

const searchTerms = [
  "Agent",
  "Back to Agent",
  "Customize Agent to get a better, more personalized experience.",
  "Rules help guide the behavior of Agent.",
  "Workflows",
  "Workflows are saved prompts that Agent can follow. To trigger a workflow, type \"/\" in Agent.",
  "Global",
  "Workspace",
  "Manage",
  "Snooze",
  "Start",
  "Advanced Settings",
  "Open Command",
  "Open Agent",
  "View all Antigravity IDE shortcuts",
  "Reset to default shortcuts",
  "Background Processes Running",
  "Last Updated",
  "helpperform",
  "help perform",
  "pages",
  "Launch",
  "Browser"
];

const results = [];

function search(content, name, terms) {
  if (!content) {
    results.push(`[INFO] File ${name} does not exist or is empty.`);
    return;
  }
  results.push(`\n\n==================== SEARCHING IN ${name} ====================`);
  terms.forEach(term => {
    let index = 0;
    let occurrences = [];
    while (true) {
      const idx = content.indexOf(term, index);
      if (idx === -1) break;
      occurrences.push(idx);
      index = idx + 1;
    }
    
    results.push(`\n--- Term: "${term}" (Total Found: ${occurrences.length}) ---`);
    occurrences.slice(0, 10).forEach((idx, count) => {
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      results.push(`[${term}] Occur #${count + 1} at Index ${idx}:`);
      results.push(`   ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    });
    if (occurrences.length > 10) {
      results.push(`   ... and ${occurrences.length - 10} more matches`);
    }
  });
}

search(mainContent, 'main.js', searchTerms);
search(wbContent, 'workbench.desktop.main.js', searchTerms);
search(extContent, 'extension.js', searchTerms);

fs.writeFileSync('scratch/locate_user_request_results.txt', results.join('\n'), 'utf8');
console.log('Search completed. Results written to scratch/locate_user_request_results.txt');
