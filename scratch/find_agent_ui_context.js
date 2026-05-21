import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainPath)) {
  console.error(`Missing main.js.bak at ${mainPath}`);
  process.exit(1);
}

const content = fs.readFileSync(mainPath, 'utf8');

const stringsToFind = [
  'New Conversation',
  'No Model Selected',
  'Select Model',
  'Select another model',
  'Copy conversation markdown',
  'Archive this conversation',
  'Delete Conversation',
  'Other Conversations',
  'Ask Agent for Help',
  'Blocked on Your Input',
  'User cancelled agent execution.',
  'Thinking...',
  'Thinking',
  'Running',
  'Stopped',
  'Idle',
  'In Progress',
  'Skipped',
  'Tool Output',
  'Tool arguments',
  'Task Logs',
  'View Debug',
  'View Diff',
  'View Logs',
  'View network requests',
  'Toggle Sidebar',
  'Toggle Auxiliary Pane',
  'Toggle Terminal',
  'Toggle Model Selector',
  'Toggle Project Selector',
  'Open Conversation History',
  'Open Conversation Picker',
  'Select workspace',
  'Close Workspace',
  'Skills and Customizations',
  'Skills are instructions that extend what Agent can do.',
  'This skill is installed in your workspace'
];

const results = {};

for (const str of stringsToFind) {
  let idx = 0;
  const occurrences = [];
  while (true) {
    idx = content.indexOf(str, idx);
    if (idx === -1) break;
    
    // Extract context: 80 chars before, string itself, 80 chars after
    const start = Math.max(0, idx - 80);
    const end = Math.min(content.length, idx + str.length + 80);
    const context = content.substring(start, end);
    occurrences.push({ index: idx, context });
    
    idx += str.length;
    if (occurrences.length >= 5) {
      break; // Limit to 5 per string to avoid spam
    }
  }
  results[str] = occurrences;
}

fs.writeFileSync('scratch/agent_ui_contexts.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Context extraction complete. Results written to scratch/agent_ui_contexts.json');
