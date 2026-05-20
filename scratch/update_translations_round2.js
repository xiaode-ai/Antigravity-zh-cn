import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Current translations count: ${translations.length}`);

// 1. Remove any old duplicate window title rule if it exists
translations = translations.filter(t => t.old !== 'children:["Settings - ",e]' && t.old !== 'children:[\"Settings - \",e]');
console.log(`Cleaned up old window title rules. Remaining count: ${translations.length}`);

// 2. Define the new rules to prepend
const newRules = [
  // A. Dynamic Window Title Rule
  {
    "old": "children:[\"Settings - \",e]",
    "new": "children:[\"设置 - \",({\"General\":\"常规\",\"Account\":\"账户\",\"Permissions\":\"权限\",\"Appearance\":\"外观\",\"Notifications\":\"通知\",\"Models\":\"模型\",\"Customizations\":\"自定义\",\"Browser\":\"浏览器\",\"Tab\":\"标签页\",\"Editor\":\"编辑器\",\"App\":\"应用\",\"Best of N\":\"Best of N\",\"Shortcuts\":\"快捷键\",\"Provide Feedback\":\"提供反馈\",\"Workspaces\":\"工作区\",\"Projects\":\"项目\",\"Not in Project\":\"非项目中\",\"Conversations\":\"普通对话\",\"Show all\":\"显示全部\"}[e]||e)]"
  },
  // B. Sidebar Category Header: General
  {
    "old": "p(\"span\",{className:\"text-xs font-medium text-muted-foreground select-none\",children:\"General\"})",
    "new": "p(\"span\",{className:\"text-xs font-medium text-muted-foreground select-none\",children:\"常规\"})"
  },
  // C. Sidebar Category Header: Workspaces
  {
    "old": "p(\"span\",{className:\"text-xs font-medium text-muted-foreground select-none\",children:\"Workspaces\"})",
    "new": "p(\"span\",{className:\"text-xs font-medium text-muted-foreground select-none\",children:\"工作区\"})"
  },
  // D. Artifact Review Policy Options Array
  {
    "old": "$1t=[{value:e0.TURBO,label:\"Always Proceed\",description:\"Agent never asks for review. This maximizes the autonomy of the Agent, but also has the highest risk of the Agent operating over unsafe or injected Artifact content.\",disabledInSecureMode:!0},{value:e0.ALWAYS,label:\"Always Ask\",description:\"Agent always asks for review.\",disabledInSecureMode:!1}]",
    "new": "$1t=[{value:e0.TURBO,label:\"始终执行\",description:\"智能体从不请求审核。这最大化了智能体的自主性，但也有智能体在不安全或被注入的产物内容上运行的最高风险。\",disabledInSecureMode:!0},{value:e0.ALWAYS,label:\"每次询问\",description:\"智能体总是请求审核。\",disabledInSecureMode:!1}]"
  },
  // E. Browser JS Execution Option Map
  {
    "old": "t){case vh.DISABLED:return\"Disabled\";case vh.ALWAYS_ASK:return\"Request Review\";case vh.TURBO:return\"Always Proceed\";default:return\"Request Review\"}},resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return\"Block all browser JavaScript execution.\";case vh.ALWAYS_ASK:return\"Prompt for approval before running browser scripts.\";case vh.TURBO:return\"Allow full browser script execution without prompting.\";default:return\"Prompt for approval before running browser scripts.\"}}",
    "new": "t){case vh.DISABLED:return\"已禁用\";case vh.ALWAYS_ASK:return\"需要审核\";case vh.TURBO:return\"始终执行\";default:return\"需要审核\"}},resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return\"阻止所有浏览器 JavaScript 执行。\";case vh.ALWAYS_ASK:return\"在运行浏览器脚本前提示审核。\";case vh.TURBO:return\"允许完全执行浏览器脚本而无需提示。\";default:return\"在运行浏览器脚本前提示审核。\"}}"
  }
];

// Prepend the new rules to the top of translations list
translations.unshift(...newRules);
console.log(`Prepended ${newRules.length} new rules to the translations. Total count: ${translations.length}`);

// Write back to translations.json
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log(`Saved Round 2 updates to translations.json`);
