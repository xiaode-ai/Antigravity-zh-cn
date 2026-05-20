import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

const newEntries = [
  // 1. 汉化 qne 的 Trigger 选中项显示逻辑：将渲染 e 修改为渲染 displayResolver 的 r(e)
  {
    "old": "children:[p(\"span\",{className:\"capitalize\",children:e}),p(qe,{name:\"keyboard_arrow_down\",className:\"w-3 h-3 opacity-70 ml-auto\"})]})}),p(ns.Content",
    "new": "children:[p(\"span\",{className:\"capitalize\",children:r(e)}),p(qe,{name:\"keyboard_arrow_down\",className:\"w-3 h-3 opacity-70 ml-auto\"})]})}),p(ns.Content"
  },
  // 2. 汉化 P7i 组件中的 displayResolver 映射关系
  {
    "old": "p(qne,{value:e.mode,options:[\"allow\",\"ask\",\"deny\"],displayResolver:g=>g,onSelect:g=>{r(t,e.value,g)}})",
    "new": "p(qne,{value:e.mode,options:[\"allow\",\"ask\",\"deny\"],displayResolver:g=>g===\"allow\"?\"允许\":g===\"ask\"?\"总是询问\":g===\"deny\"?\"拒绝\":g,onSelect:g=>{r(t,e.value,g)}})"
  },
  // 3. 汉化 P7i 上层列表组件中的 displayResolver 映射关系
  {
    "old": "p(qne,{value:y,options:[\"allow\",\"ask\",\"deny\"],displayResolver:I=>I,onSelect:I=>{F(I)}})",
    "new": "p(qne,{value:y,options:[\"allow\",\"ask\",\"deny\"],displayResolver:I=>I===\"allow\"?\"允许\":I===\"ask\"?\"总是询问\":I===\"deny\"?\"拒绝\":I,onSelect:I=>{F(I)}})"
  },
  // 4. 汉化局部 read/edit 下拉框 displayResolver 映射关系
  {
    "old": "p(qne,{value:e.level,options:[\"read\",\"edit\"],displayResolver:u=>u,onSelect:u=>{t(u)}})",
    "new": "p(qne,{value:e.level,options:[\"read\",\"edit\"],displayResolver:u=>u===\"read\"?\"读取\":u===\"edit\"?\"修改\":u,onSelect:u=>{t(u)}})"
  }
];

// 去重添加
let addedCount = 0;
for (const entry of newEntries) {
  if (!translations.some(t => t.old === entry.old)) {
    translations.push(entry);
    addedCount++;
  } else {
    // 如果已经存在同名的 old，我们需要更新它
    const idx = translations.findIndex(t => t.old === entry.old);
    translations[idx] = entry;
    console.log(`Updated existing translation entry for: ${entry.old.substring(0, 50)}...`);
  }
}

console.log(`Added ${addedCount} new unique translations. Total: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully updated translations.json with round 6 drop-down fix!');
