import fs from 'fs';
import path from 'path';

const resultsPath = path.join(process.cwd(), 'scratch', 'search_all_out_results.txt');
if (!fs.existsSync(resultsPath)) {
  console.log('Results file not found.');
  process.exit(1);
}

const content = fs.readFileSync(resultsPath, 'utf8');
const blocks = content.split('\n\n');

console.log(`Total blocks: ${blocks.length}`);

const targets = [
  'Limited time',
  'Limited-time',
  'limited time',
  'Open Antigravity IDE User Settings',
  'Antigravity - Settings'
];

blocks.forEach(block => {
  targets.forEach(t => {
    if (block.includes(`Term: "${t}"`)) {
      console.log('------------------------------------');
      console.log(block);
    }
  });
});
