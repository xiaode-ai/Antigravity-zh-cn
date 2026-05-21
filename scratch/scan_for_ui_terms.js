import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const terms = [
  'Approve', 'Reject', 'Allow', 'Deny', 'Always allow', 'Always deny', 'Allow once',
  'Approved', 'Rejected', 'Allowed', 'Denied', 'Pending', 'Ask permission',
  'Send', 'Cancel', 'Stop', 'Retry', 'Ignore', 'Clear', 'Close'
];

console.log('=== 扫描 Toggle Agent 潜在的 UI 控件字符串 ===');

terms.forEach(term => {
  console.log(`\n--- 词条: "${term}" ---`);
  let idx = -1;
  let count = 0;
  while ((idx = content.indexOf(term, idx + 1)) !== -1) {
    // Look at context (e.g. 80 chars before and after)
    const context = content.substring(Math.max(0, idx - 60), Math.min(content.length, idx + term.length + 60));
    
    // Only show if it matches patterns like children: "term", label: "term", tooltip: "term", etc.
    const isUIContext = /children:|label:|tooltip:|title:|placeholder:|text:|value:|ariaLabel:|aria-label:|button|click|action/i.test(context);
    
    if (isUIContext) {
      count++;
      if (count <= 25) {
        console.log(`[匹配 ${count}] (索引 ${idx}): ... ${context.trim().replace(/\n/g, ' ')} ...`);
      }
    }
  }
  if (count > 25) {
    console.log(`... 还有 ${count - 25} 个匹配未显示。`);
  }
  if (count === 0) {
    console.log('未找到 UI 相关的上下文。');
  }
});
