import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainPath)) {
  console.error(`Missing main.js.bak at ${mainPath}`);
  process.exit(1);
}

const content = fs.readFileSync(mainPath, 'utf8');

const targets = [
  'Approve',
  'Reject',
  'Accept',
  'Allow',
  'Deny',
  'Stop All',
  'Subagents',
  'Ask every time',
  'Always run',
  'Ask first',
  'disabledReason',
  'promptText',
  'Reject all',
  'Reject All',
  'New Workspace'
];

targets.forEach(target => {
  console.log(`\n--- Searching for: "${target}" ---`);
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    
    const start = Math.max(0, idx - 120);
    const end = Math.min(content.length, idx + target.length + 120);
    const snippet = content.substring(start, end);
    
    // Filter to keep JS object/React element contexts
    if (snippet.includes('children:') || snippet.includes('label:') || snippet.includes('tooltip:') || snippet.includes('title:') || snippet.includes('promptText') || snippet.includes('disabledReason') || snippet.includes('option:')) {
      count++;
      console.log(`[MATCH #${count}] Index: ${idx}`);
      console.log(snippet.trim().replace(/\s+/g, ' '));
      console.log('-'.repeat(40));
    }
    
    idx += target.length;
    if (count >= 15) {
      console.log('... (truncated)');
      break;
    }
  }
});
