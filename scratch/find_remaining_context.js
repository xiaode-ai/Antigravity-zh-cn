import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

// 找到残留英文 "Require Review" 附近的完整 switch 语句
const idx = content.indexOf('Require Review');
if (idx !== -1) {
  console.log('=== 当前 main.js 中 "Require Review" 的上下文 ===');
  console.log(content.substring(idx - 300, idx + 400));
}

// 同样在 backup 中查找
const backupPath = targetPath + '.bak';
const backup = fs.readFileSync(backupPath, 'utf8');

// 找到 backup 中对应位置
const patterns = [
  'CASCADE_AUTO_EXECUTION_POLICY:return',
  'ALLOW_AGENT_ACCESS_NON_WORKSPACE_FILES:return',
];

for (const pat of patterns) {
  let bidx = 0;
  let count = 0;
  while ((bidx = backup.indexOf(pat, bidx)) !== -1) {
    count++;
    console.log(`\n=== BACKUP [${pat}] #${count} at ${bidx} ===`);
    console.log(backup.substring(bidx - 100, bidx + 300));
    bidx += pat.length;
  }
}

// 检查 "Enabled" 和 "Disabled" 是否仍有残留
const enDisTerms = ['"Enabled"', '"Disabled"'];
for (const t of enDisTerms) {
  let tidx = 0;
  let count = 0;
  while ((tidx = content.indexOf(t, tidx)) !== -1) {
    count++;
    if (count <= 3) {
      console.log(`\n[${t}] #${count} at ${tidx}:`);
      console.log(content.substring(Math.max(0, tidx - 100), tidx + 200));
    }
    tidx += t.length;
  }
  console.log(`[${t}] Total occurrences: ${count}`);
}
