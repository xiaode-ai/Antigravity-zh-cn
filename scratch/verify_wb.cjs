const fs = require('fs');
const c = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');
const bak = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

const targets = [
  ['Past Conversations', '历史对话'],
  ['Additional Options', '更多选项'],
  ['Close Agent View', '关闭智能体视图'],
  ['AI may make mistakes', 'AI 可能会犯错'],
  ['Record Audio', '录制音频'],
  ['Stop Recording', '停止录音'],
  ['label:"Media"', 'label:"媒体"'],
  ['label:"Mentions"', 'label:"提及"'],
  ['title:{value:"Agent"', 'title:{value:"智能体"'],
  ['name:{value:"Agent"', 'name:{value:"智能体"'],
  ['displayName:"Agent"', 'displayName:"智能体"'],
  ['children:"Agent"', 'children:"智能体"'],
];

console.log('=== Workbench Translation Verification ===');
targets.forEach(([en, zh]) => {
  const bakHasEn = bak.includes(en);
  const hasEn = c.includes(en);
  const hasZh = c.includes(zh);
  console.log(`${en.padEnd(35)} | bak:${bakHasEn ? 'Y' : 'N'} | cur_EN:${hasEn ? 'Y' : 'N'} | cur_ZH:${hasZh ? 'Y' : 'N'} | ${hasZh ? '✅' : (bakHasEn && !hasEn ? '✅ (replaced)' : '❌ NOT FOUND')}`);
});
