import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Loaded ${translations.length} translations.`);

// Helper function to update translations by their 'old' string
function updateTranslation(oldString, updater) {
  const index = translations.findIndex(t => t.old === oldString);
  if (index !== -1) {
    const oldValue = translations[index].new;
    translations[index].new = updater(translations[index].new);
    console.log(`[SUCCESS] Updated item at index ${index}. Changed from:\n  "${oldValue.substring(0, 80)}..."\n  to:\n  "${translations[index].new.substring(0, 80)}..."`);
    return true;
  } else {
    console.error(`[ERROR] Could not find item with old string starting with: "${oldString.substring(0, 50)}..."`);
    return false;
  }
}

// 1. Update Index 150: prevent secondary replacement collision on "Rules", "Skills", "MCP", "System Prompt"
const oldIdx150Old = 'p("div",{className:"flex items-center gap-2",children:[p("div",{className:"w-2 h-2 rounded-full shrink-0",style:{backgroundColor:b.color}}),p("span",{className:"text-secondary-foreground",children:b.label}),p("span",{className:"tabular-nums text-muted-foreground",children:[n?`(${r(b.tokens).toFixed(1)}%) `:"",iFe(b.tokens)]})]})';
updateTranslation(oldIdx150Old, () => {
  return 'p("div",{className:"flex items-center gap-2",children:[p("div",{className:"w-2 h-2 rounded-full shrink-0",style:{backgroundColor:b.color}}),p("span",{className:"text-secondary-foreground",children:({["Ru"+"les"]:"规则",["Sk"+"ills"]:"技能",["MC"+"P"]:"MCP 服务端",["Sys"+"tem Prompt"]:"系统提示词"}[b.label]||b.label)}),p("span",{className:"tabular-nums text-muted-foreground",children:[n?`(${r(b.tokens).toFixed(1)}%) `:"",iFe(b.tokens)]})]})';
});

// 2. Remove parenthesized English from plugins in Item 538 and 540
const cleanupPluginName = (str) => {
  return str
    .replace(/科学 \(Science\)/g, '科学')
    .replace(/Chrome 开发者工具 \(Chrome DevTools\)/g, 'Chrome 开发者工具')
    .replace(/现代 Web 指南 \(Modern Web Guidance\)/g, '现代 Web 指南');
};

const oldIdx538Old = 'p(B2,{checked:e.includes(I.uid),onChange:()=>N(I.uid),alignTop:!0,label:p("span",{className:"font-medium text-sm",children:I.name})})';
updateTranslation(oldIdx538Old, cleanupPluginName);

const oldIdx540Old = 'p("div",{className:"flex flex-col",children:[p("span",{className:"text-sm font-medium",children:x.plugin?.name||D}),p("span",{className:"text-xs text-muted-foreground mt-0.5 line-clamp-2",children:x.plugin?.description||"No description available."})]})';
updateTranslation(oldIdx540Old, cleanupPluginName);

// 3. Update Item 145: Translate Build With Google Plugins fully to 使用 Google 插件, Customize to 自定义
const oldIdx145Old = 'title:"Build With Google Plugins",children:p(yo,{children:p(Wd,{label:"Build With Google Plugins",rightElement:p(lo,{onClick:()=>{j("bwg_plugins")},children:"Customize"})})})';
updateTranslation(oldIdx145Old, () => {
  return 'title:"使用 Google 插件",children:p(yo,{children:p(Wd,{label:"使用 Google 插件",rightElement:p(lo,{onClick:()=>{j("bwg_plugins")},children:"自定义"})})})';
});

// 4. Update Item 146: Translate children:"Build With Google Plugins" fully to children:"使用 Google 插件"
const oldIdx146Old = 'children:"Build With Google Plugins"';
updateTranslation(oldIdx146Old, () => {
  return 'children:"使用 Google 插件"';
});

// 5. Add new translations for Build with Antigravity IDE Plugins and Google Plugins headings
const newTranslations = [
  {
    "old": "p(Xl,{title:`Build with ${e} Plugins`,headerRight:p(lo,{onClick:N,disabled:d,className:\"flex items-center whitespace-nowrap bg-muted hover:bg-secondary border border-border text-xs px-2 py-0.5\",children:[d?\"Refreshing...\":\"Refresh\",p(qe,{name:\"cached\",className:`w-3 h-3 ml-1 ${d?\"animate-spin\":\"\"}`})]})",
    "new": "p(Xl,{title:`使用 ${e} 插件`,headerRight:p(lo,{onClick:N,disabled:d,className:\"flex items-center whitespace-nowrap bg-muted hover:bg-secondary border border-border text-xs px-2 py-0.5\",children:[d?\"正在刷新...\":\"刷新\",p(qe,{name:\"cached\",className:`w-3 h-3 ml-1 ${d?\"animate-spin\":\"\"}`})]})"
  },
  {
    "old": "p(\"h2\",{className:\"text-lg font-medium\",children:\"Build With Google Plugins\"})",
    "new": "p(\"h2\",{className:\"text-lg font-medium\",children:\"使用 Google 插件\"})"
  }
];

newTranslations.forEach(newItem => {
  const exists = translations.some(existing => existing.old === newItem.old);
  if (!exists) {
    translations.push(newItem);
    console.log(`[ADDED] New translation: "${newItem.old.substring(0, 50)}..." -> "${newItem.new.substring(0, 50)}..."`);
  } else {
    // If it exists, update it to ensure correctness
    const existingIndex = translations.findIndex(existing => existing.old === newItem.old);
    translations[existingIndex].new = newItem.new;
    console.log(`[SUCCESS] Updated existing new item at index ${existingIndex}`);
  }
});

fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
console.log('translations.json updated and formatted successfully.');
