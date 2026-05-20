import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

// 1. Remove the old mismatched Account children entry
const filterBefore = translations.length;
translations = translations.filter(t => !t.old.includes('title:"Account",children:p(yo,{children:[s==="signedIn"&&'));
console.log(`Removed mismatched entries: ${filterBefore - translations.length}`);

// 2. Remove the old Your Plan entry so we can place the corrected one at the top
const filterBefore2 = translations.length;
translations = translations.filter(t => !t.old.includes('Your Plan: ') || !t.old.includes('description:x'));
console.log(`Removed old plan entries: ${filterBefore2 - translations.length}`);

// 3. Find and update the Terminal Command Auto Execution entry
let updatedCount = 0;
for (let i = 0; i < translations.length; i++) {
  if (translations[i].old.includes('Terminal Command Auto Execution') && translations[i].old.includes('Cider')) {
    translations[i].old = "screen:\"Permissions\",label:\"Terminal Command Auto Execution\",description:e===\"Cider\"?`Google-wide Allowlist: If you are eligible, commands in the this list run without your approval, in addition to the below options. This policy applies to any host, regardless of internet connectivity. Check on eligibility on go/can-i-autorun-agents.\n\nNote: please reload for these changes to take effect.`:`Controls whether terminal commands require your approval before running.\n\nNote: A change to this setting will only apply to new messages sent to Agent. In-progress responses will use the previous setting value.`,options:[rl.EAGER,rl.PROCEED_IN_SANDBOX,rl.OFF],resolveOptionToString:t=>{switch(t){case rl.EAGER:return\"Always Proceed\";case rl.OFF:return\"Request Review\";default:return\"Proceed in Sandbox\"}}";
    
    translations[i].new = "screen:\"Permissions\",label:\"终端命令自动执行\",description:e===\"Cider\"?`谷歌范围内白名单：如果您符合条件，此列表中的命令无需您的批准即可运行（除以下选项外）。此策略适用于任何主机，无论互联网连接如何。请在 go/can-i-autorun-agents 检查您的资格。\n\n注意：请重新加载以使这些更改生效。`:`控制终端命令在运行前是否需要您的批准。\n\n注意：对此设置的更改将仅适用于发送给智能体的新消息。正在进行中的响应将使用之前的设置值。`,options:[rl.EAGER,rl.PROCEED_IN_SANDBOX,rl.OFF],resolveOptionToString:t=>{switch(t){case rl.EAGER:return\"始终执行\";case rl.OFF:return\"需要审核\";default:return\"在沙箱中执行\"}}";
    updatedCount++;
  }
}
console.log(`Updated Terminal Command entries: ${updatedCount}`);

// 4. Define our new high-priority rules (to be prepended at the top)
const newRules = [
  // A. Window Title Rule
  {
    "old": "children:[\"Settings - \",e]",
    "new": "children:[\"设置 - \",e]"
  },
  // B. Card Title: General
  {
    "old": "p(Xl,{title:\"General\",children:p(yo,{",
    "new": "p(Xl,{title:\"常规\",children:p(yo,{"
  },
  // C. Card Title: Account
  {
    "old": "p(Xl,{title:\"Account\",children:p(yo,{",
    "new": "p(Xl,{title:\"账户\",children:p(yo,{"
  },
  // D. Your Plan & Description Long Rule (Specific rule matched before the short rule)
  {
    "old": "label:p(\"div\",{className:\"text-sm font-medium\",children:[\"Your Plan: \",I]}),description:x,",
    "new": "label:p(\"div\",{className:\"text-sm font-medium\",children:[\"您的方案: \",I]}),description:((\"You can upgrade to a Google AI Ultra plan to receive the highest rate limits.\"===\"You can upgrade to a Google AI Ultra plan to receive the highest rate limits.\"?\"您可以升级至 Google AI Ultra 方案以获得最高的频次额度限制。\":\"\")||x),"
  }
];

// Prepend the new rules
translations.unshift(...newRules);
console.log(`Prepended ${newRules.length} new rules to the top of the translations.`);

// Save back
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log(`Updated translations saved back to translations.json. Total entries: ${translations.length}`);
