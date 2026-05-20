import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

const newEntries = [
  // 1. Learn more (了解更多)
  {
    "old": "title:\"Learn more\"",
    "new": "title:\"了解更多\""
  },
  {
    "old": "children:\"Learn more\"",
    "new": "children:\"了解更多\""
  },
  {
    "old": "children:F??\"Learn more\"",
    "new": "children:F??\"了解更多\""
  },
  {
    "old": "children:\"Learn more.\"",
    "new": "children:\"了解更多。\""
  },
  {
    "old": "\"Learn more about\"",
    "new": "\"了解更多关于\""
  },
  {
    "old": "\"Please verify your account, then sign in again to continue. Learn more by visiting our\"",
    "new": "\"请验证您的账户，然后重新登录以继续。了解更多信息请访问我们的\""
  },
  {
    "old": "\"Learn more by visiting our\"",
    "new": "\"了解更多信息请访问我们的\""
  },
  {
    "old": "\". Learn more about skills at\"",
    "new": "\"。了解更多关于技能的信息，请访问\""
  },

  // 2. Deny (拒绝)
  {
    "old": "Ju.DENY?\"Deny\"",
    "new": "Ju.DENY?\"拒绝\""
  },
  {
    "old": "et===Ju.ALLOW?\"Allow\":et===Ju.DENY?\"Deny\":\"Always Ask\"",
    "new": "et===Ju.ALLOW?\"允许\":et===Ju.DENY?\"拒绝\":\"总是询问\""
  },
  {
    "old": "it===Ju.ALLOW?\"Allow\":it===Ju.DENY?\"Deny\":\"Always Ask\"",
    "new": "it===Ju.ALLOW?\"允许\":it===Ju.DENY?\"拒绝\":\"总是询问\""
  },
  {
    "old": "label:\"Deny\",onClick:()=>t()",
    "new": "label:\"拒绝\",onClick:()=>t()"
  },
  {
    "old": "label:\"Deny\",onClick:F",
    "new": "label:\"拒绝\",onClick:F"
  },
  {
    "old": "children:\"Deny\"",
    "new": "children:\"拒绝\""
  },
  {
    "old": "\"aria-label\":\"Deny setting up browser\"",
    "new": "\"aria-label\":\"拒绝设置浏览器\""
  },
  {
    "old": "label:\"Deny List Terminal Commands\",description:\"Agent asks for permission",
    "new": "label:\"终端命令黑名单\",description:\"智能体在执行黑名单条目匹配的命令前会请求许可"
  },
  {
    "old": "\" (except those in the Deny list).\"",
    "new": "\"（在黑名单中的除外）。\""
  },

  // 3. Open (打开)
  {
    "old": "rightElement:p(lo,{onClick:()=>{re(\"file\")},children:\"Open\"})",
    "new": "rightElement:p(lo,{onClick:()=>{re(\"file\")},children:\"打开\"})"
  },
  {
    "old": "rightElement:p(lo,{onClick:()=>{re(\"network\")},children:\"Open\"})",
    "new": "rightElement:p(lo,{onClick:()=>{re(\"network\")},children:\"打开\"})"
  },
  {
    "old": "rightElement:p(lo,{onClick:()=>{re(\"command\")},children:\"Open\"})",
    "new": "rightElement:p(lo,{onClick:()=>{re(\"command\")},children:\"打开\"})"
  },
  {
    "old": "rightElement:p(lo,{onClick:()=>{re(\"unsandboxed\")},children:\"Open\"})",
    "new": "rightElement:p(lo,{onClick:()=>{re(\"unsandboxed\")},children:\"打开\"})"
  },
  {
    "old": "rightElement:p(lo,{onClick:()=>{re(\"mcp\")},children:\"Open\"})",
    "new": "rightElement:p(lo,{onClick:()=>{re(\"mcp\")},children:\"打开\"})"
  },
  {
    "old": "children:[p(\"span\",{children:\"Open\"}),p(qe,{name:\"zoom_out_map\"",
    "new": "children:[p(\"span\",{children:\"打开\"}),p(qe,{name:\"zoom_out_map\""
  },

  // 4. Add (添加)
  {
    "old": "rightElement:p(lo,{onClick:()=>{N(!0)},children:\"Add\"})",
    "new": "rightElement:p(lo,{onClick:()=>{N(!0)},children:\"添加\"})"
  },
  {
    "old": "children:[p(qe,{name:\"add\",className:\"h-3 w-3\"}),p(\"div\",{children:\"Add\"})]",
    "new": "children:[p(qe,{name:\"add\",className:\"h-3 w-3\"}),p(\"div\",{children:\"添加\"})]"
  },
  {
    "old": "p(Eo,{onClick:x,className:\"px-4 py-2 text-sm\",children:\"Add\"})",
    "new": "p(Eo,{onClick:x,className:\"px-4 py-2 text-sm\",children:\"添加\"})"
  },
  {
    "old": "p(lo,{onClick:()=>d(!0),children:\"Add\"})",
    "new": "p(lo,{onClick:()=>d(!0),children:\"添加\"})"
  },

  // 5. Edit (编辑)
  {
    "old": "rightElement:p(lo,{onClick:()=>{u(\"execute_url\")},children:\"Edit\"})",
    "new": "rightElement:p(lo,{onClick:()=>{u(\"execute_url\")},children:\"编辑\"})"
  },
  {
    "old": "bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors\",children:\"Edit\"}",
    "new": "bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors\",children:\"编辑\"}"
  },
  {
    "old": "label:\"Edit\",icon:\"edit\"",
    "new": "label:\"编辑\",icon:\"edit\""
  },

  // 6. Delete Project (删除项目)
  {
    "old": "children:\"Delete Project\"",
    "new": "children:\"删除项目\""
  },
  {
    "old": "label:\"Delete Project\"",
    "new": "label:\"删除项目\""
  },
  {
    "old": "\"Permanently delete this project and all of its conversations.\"",
    "new": "\"永久删除此项目及其所有对话。\""
  },

  // 7. Close Settings (关闭设置)
  {
    "old": "title:\"Close Settings\",children:\"\\u2715\"",
    "new": "title:\"关闭设置\",children:\"\\u2715\""
  },

  // 8. Cancel task (取消任务)
  {
    "old": "children:p(\"span\",{children:\"Cancel task\"})",
    "new": "children:p(\"span\",{children:\"取消任务\"})"
  }
];

// 去重添加，确保不重复写入
let addedCount = 0;
for (const entry of newEntries) {
  if (!translations.some(t => t.old === entry.old)) {
    translations.push(entry);
    addedCount++;
  }
}

console.log(`Added ${addedCount} new unique translations. Total: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully written translations.json!');
