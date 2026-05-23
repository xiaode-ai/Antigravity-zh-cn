import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

const newEntries = [
  // 1. Authenticating... (main.js)
  {
    "old": "message:\"Authenticating...\"",
    "new": "message:\"正在进行身份验证...\""
  },
  // 2. Authentication Error (main.js)
  {
    "old": "message:\"There was an error with your authentication. To log in, click \",action:{label:\"here\",onClick:t}",
    "new": "message:\"身份验证时出错。要登录，请点击 \",action:{label:\"此处\",onClick:t}"
  },
  // 3. Signed Out Alert (main.js)
  {
    "old": "message:\"To use the agent, please login \",action:{label:\"here\",onClick:t}",
    "new": "message:\"要使用智能体，请先登录 \",action:{label:\"此处\",onClick:t}"
  },
  // 4. Log in to use the agent (main.js)
  {
    "old": "message:\"Log in to use the agent\"",
    "new": "message:\"登录以使用智能体\""
  },
  // 5. Available AI Credits (main.js)
  {
    "old": "F&&p(Wd,{label:`Available AI Credits: ${C??\"0\"}`",
    "new": "F&&p(Wd,{label:`可用 AI 点数: ${C??\"0\"}`"
  },
  // 6. See Activity (main.js)
  {
    "old": "children:\"See Activity\"",
    "new": "children:\"查看活动记录\""
  },
  // 7. Get More AI Credits (main.js)
  {
    "old": "children:\"Get More AI Credits\"",
    "new": "children:\"获取更多 AI 点数\""
  },
  // 8. Model quota exhausted warning (main.js)
  {
    "old": "modelWarning:\"Model quota exhausted\"",
    "new": "modelWarning:\"模型配额已耗尽\""
  },
  // 9. For Antigravity Business consumption options, see documentation (main.js)
  {
    "old": "children:[\"For Antigravity Business consumption options, see\",\" \",p(\"a\",{href:\"https://antigravity.google/docs/enterprise\",className:\"text-primary hover:underline\",target:\"_blank\",rel:\"noopener noreferrer\",children:\"documentation\"}),\".\"]",
    "new": "children:[\"有关 Antigravity 商业版消费选项，请参阅\",\" \",p(\"a\",{href:\"https://antigravity.google/docs/enterprise\",className:\"text-primary hover:underline\",target:\"_blank\",rel:\"noopener noreferrer\",children:\"文档说明\"}),\"。\"]"
  },
  // 10. Insufficient AI Credits (main.js)
  {
    "old": "title:\"Insufficient AI Credits\"",
    "new": "title:\"AI 点数不足\""
  },
  // 11. Purchase Credits (main.js)
  {
    "old": "label:\"Purchase Credits\"",
    "new": "label:\"购买点数\""
  },
  // 12. See Plans (main.js)
  {
    "old": "label:\"See Plans\"",
    "new": "label:\"查看方案\""
  },
  // 13. Recording... status (main.js)
  {
    "old": "children:[e?\"Recording\":\"Processing\",\"...\"]",
    "new": "children:[e?\"正在录音\":\"正在处理\",\"...\"]"
  },
  // 14. Already recording (workbench.desktop.main.js)
  {
    "old": "message:\"Already recording\"",
    "new": "message:\"已在录制中\""
  },
  // 15. No active recording (workbench.desktop.main.js)
  {
    "old": "message:\"No active recording\"",
    "new": "message:\"没有活动中的录音\""
  },
  // 16. No chat model metadata (for this generator) (main.js)
  {
    "old": "children:\"No chat model metadata available for this generator\"",
    "new": "children:\"此生成器没有可用的聊天模型元数据\""
  },
  // 17. No chat model metadata (in latest generator metadata) (main.js)
  {
    "old": "children:\"No chat model metadata available in latest generator metadata\"",
    "new": "children:\"最新的生成器元数据中没有可用的聊天模型元数据\""
  }
];

// 去重添加：检查 translations 中是否已经存在相同的 old 值
let addedCount = 0;
newEntries.forEach(entry => {
  const exists = translations.some(t => t.old === entry.old);
  if (!exists) {
    translations.push(entry);
    addedCount++;
  } else {
    console.log(`Entry for '${entry.old.substring(0, 30)}...' already exists, skipped.`);
  }
});

console.log(`Added ${addedCount} new entries. Total translations count now: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully updated translations.json!');
