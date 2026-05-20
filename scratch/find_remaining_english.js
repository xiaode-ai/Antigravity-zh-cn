import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

// 搜索残留的英文关键词及其上下文
const searchTerms = [
  'Proceed in Sandbox',
  'Require Review',
  'Always Proceed',
  'Always Ask',
  'Request Review',
  'Manually customize',
  'Enable Sandbox',
  'Configures how the agent',
  'Controls whether terminal',
  'Restricts agent tools',
  'Outside of folders',
  'Security Preset',
  'Terminal Command Auto',
  'browser JavaScript execution',
  'approval before running browser',
  'browser script execution without',
];

for (const term of searchTerms) {
  let idx = 0;
  let count = 0;
  while ((idx = content.indexOf(term, idx)) !== -1) {
    count++;
    console.log(`\n[${term}] Occurrence #${count} at index ${idx}:`);
    console.log(content.substring(Math.max(0, idx - 80), idx + term.length + 120));
    console.log('---');
    idx += term.length;
  }
  if (count === 0) {
    console.log(`[${term}] ✅ 已全部清除`);
  }
}
