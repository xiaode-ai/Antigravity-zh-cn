const fs = require('fs');
const path = require('path');

const clpDir = path.join(process.env.APPDATA, 'Antigravity IDE', 'clp');

function walk(dir, results = []) {
  fs.readdirSync(dir).forEach(file => {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) walk(fp, results);
    else if (file === 'nls.messages.json') results.push(fp);
  });
  return results;
}

const nlsFiles = walk(clpDir);
console.log(`Found ${nlsFiles.length} CLP NLS files\n`);

const checks = [
  { index: 4968, expected: '切换智能体', label: 'Toggle Agent' },
  { index: 3310, expected: '快速打开', label: 'Quick Open (3310)' },
  { index: 4206, expected: '快速打开', label: 'Quick Open (4206)' },
  { index: 4967, expected: '打开浏览器 (预览)', label: 'Open Browser (Preview)' },
  { index: 3104, expected: '个人资料', label: 'Profile (3104)' },
  { index: 4034, expected: '个人资料', label: 'Profile (4034)' },
];

nlsFiles.forEach(fp => {
  console.log(`--- ${fp} ---`);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  checks.forEach(({ index, expected, label }) => {
    const val = data[index];
    const ok = val === expected;
    console.log(`  [${index}] ${label}: "${val}" ${ok ? '✅' : '❌ expected: ' + expected}`);
  });
  console.log('');
});
