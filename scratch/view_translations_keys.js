import fs from 'fs';

const path = 'translations.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log(`Total entries: ${data.length}`);
console.log('First 5 entries:');
console.log(JSON.stringify(data.slice(0, 5), null, 2));

// Search for entries containing "Agent"
const agentEntries = data.filter(entry => 
  entry.old.toLowerCase().includes('agent') || 
  entry.new.toLowerCase().includes('agent') ||
  entry.new.toLowerCase().includes('智能体')
);
console.log(`\nFound ${agentEntries.length} entries containing "agent" or "智能体":`);
agentEntries.forEach((entry, i) => {
  console.log(`[${i+1}]: old: "${entry.old.substring(0, 80)}" -> new: "${entry.new.substring(0, 80)}"`);
});
