import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const main = fs.readFileSync(mainPath, 'utf8');

// 全面搜索设置页面中所有仍然残留的英文UI文本
const englishPatterns = [
  // 摘要/概览函数
  'Require Review',
  'Proceed in Sandbox',
  '"Enabled"',
  '"Disabled"',
  // 下拉选项 labels
  'label:"Disabled"',
  // 描述文本
  'Path to the Chrome/Chromium',
  'Leave empty for auto-detection',
  'Absolute path to the Chrome',
  'JavaScript execution disabled in strict mode',
  'Configures how the agent',
  'Controls whether terminal',
  'Restricts agent tools to a secure',
  'When enabled, Antigravity will play',
  'Enable Sounds for Agent',
  'auto-expand the toolbar',
  // 其他设置标签和描述
  'Chrome Binary Path',
  'Outside of folders',
  'file access policy',
  'Terminal Command Auto Execution',
  'Security Preset',
  'Enable Sandbox Mode',
  'Agent Settings',
  'Artifact Review Policy',
  'Browser JavaScript Execution',
  'Enable Telemetry',
  'Marketing Emails',
  'Your Plan',
  'Upgrade Plan',
  'Log Out',
  'Terms of Service',
  'Manage your plans',
  'By using this app',
];

console.log('=== 全面英文残留扫描 ===\n');
for (const pat of englishPatterns) {
  let idx = 0;
  let count = 0;
  while ((idx = main.indexOf(pat, idx)) !== -1) {
    count++;
    if (count <= 2) {
      console.log(`[${pat}] #${count} at ${idx}:`);
      const ctx = main.substring(Math.max(0, idx - 60), idx + pat.length + 100);
      console.log(ctx);
      console.log('---');
    }
    idx += pat.length;
  }
  if (count === 0) {
    console.log(`✅ "${pat}" 已全部清除`);
  } else if (count > 2) {
    console.log(`[${pat}] 共 ${count} 处残留`);
  }
}
