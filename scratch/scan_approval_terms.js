import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const terms = [
  'Approve', 'Reject', 'Allow', 'Deny', 'Always allow', 'Always deny', 'Allow once',
  'Approved', 'Rejected', 'Allowed', 'Denied', 'Pending', 'Ask permission'
];

let output = '=== 审批与权限相关 UI 字段抓取 ===\n';

terms.forEach(term => {
  output += `\n--- 词条: "${term}" ---\n`;
  let idx = -1;
  let count = 0;
  while ((idx = content.indexOf(term, idx + 1)) !== -1) {
    const context = content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + term.length + 100));
    
    // Check if it's UI context
    const isUIContext = /children:|label:|tooltip:|title:|placeholder:|text:|value:|ariaLabel:|aria-label:|button|click|action|primary|secondary/i.test(context);
    
    if (isUIContext) {
      count++;
      output += `[匹配 ${count}] (索引 ${idx}):\n  Code: ${context.trim().replace(/\s+/g, ' ')}\n`;
    }
  }
  if (count === 0) {
    output += '未找到相关 UI 上下文。\n';
  }
});

fs.writeFileSync('./scratch/approval_terms.txt', output, 'utf8');
console.log('Done! Written to scratch/approval_terms.txt');
