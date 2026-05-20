import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

const newEntries = [
  // 1. 汉化“终端命令自动执行策略”的各个下拉菜单选项的详细描述小字
  {
    "old": "resolveOptionToDescription:t=>{switch(t){case rl.EAGER:return\"Agent never asks for confirmation before executing terminal commands (except those in the Deny list). This provides the Agent with the maximum ability to operate over long periods without intervention, but also has the highest risk of an Agent executing an unsafe terminal command.\";case rl.OFF:return\"Agent always asks for confirmation before executing terminal commands (except those in the Allow list).\";default:return\"Terminal command automatically proceeds if the command runs inside the sandbox. Otherwise, it requests review.\"}}",
    "new": "resolveOptionToDescription:t=>{switch(t){case rl.EAGER:return\"智能体在执行终端命令前从不请求确认（黑名单中的命令除外）。这为智能体提供了最大化的无干预长期运行能力，但智能体执行不安全终端命令的风险也最高。\";case rl.OFF:return\"智能体在执行终端命令前总是请求确认（白名单中的命令除外）。\";default:return\"如果在沙箱内运行，终端命令会自动执行；否则，将请求审核。\"}}"
  },
  // 2. 汉化“产物审核策略”的各个下拉菜单选项的详细描述小字
  {
    "old": "resolveOptionToDescription:t=>{switch(t){case e0.TURBO:return\"Agent never asks for review. This maximizes the autonomy of the Agent, but also has the highest risk of the Agent operating over unsafe or injected Artifact content.\";case e0.ALWAYS:return\"Agent always asks for review.\";default:return\"\"}}",
    "new": "resolveOptionToDescription:t=>{switch(t){case e0.TURBO:return\"智能体从不请求审核。这最大化了智能体的自主性，但也有智能体在不安全或被注入的产物内容上运行的最高风险。\";case e0.ALWAYS:return\"智能体总是请求审核。\";default:return\"\"}}"
  }
];

// 去重添加
let addedCount = 0;
for (const entry of newEntries) {
  if (!translations.some(t => t.old === entry.old)) {
    translations.push(entry);
    addedCount++;
  } else {
    const idx = translations.findIndex(t => t.old === entry.old);
    translations[idx] = entry;
    console.log(`Updated existing translation entry for dropdown description...`);
  }
}

console.log(`Added ${addedCount} new unique translations. Total: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully updated translations.json with round 7 description text fix!');
