import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

const newEntries = [
  // 1. Files / Directories / Code Context Items 侧栏上下文列表汉化 (main.js)
  {
    "old": "getRenderInfo(){let e=this.type===0?\"Files\":this.type===1?\"Directories\":\"Code Context Items\"",
    "new": "getRenderInfo(){let e=this.type===0?\"文件\":this.type===1?\"文件夹\":\"代码上下文项\""
  },
  // 2. Files / Directories / Code Context Items 侧栏上下文列表汉化 (workbench.desktop.main.js)
  {
    "old": "getRenderInfo(){let t=this.type===0?\"Files\":this.type===1?\"Directories\":\"Code Context Items\"",
    "new": "getRenderInfo(){let t=this.type===0?\"文件\":this.type===1?\"文件夹\":\"代码上下文项\""
  },
  // 3. Agent 命名汉化 (main.js & workbench.desktop.main.js 通用)
  {
    "old": "displayName:\"Agent\"",
    "new": "displayName:\"智能体\""
  },
  // 4. Agent 文本标签汉化 (workbench.desktop.main.js)
  {
    "old": "className:\"text-muted-foreground\",children:\"Agent\"",
    "new": "className:\"text-muted-foreground\",children:\"智能体\""
  },
  // 5. Agent 标题属性汉化 (workbench.desktop.main.js)
  {
    "old": "title:{value:\"Agent\",original:\"Agent\"}",
    "new": "title:{value:\"智能体\",original:\"Agent\"}"
  },
  // 6. Agent 名字属性汉化 (workbench.desktop.main.js)
  {
    "old": "name:{value:\"Agent\",original:\"Agent\"}",
    "new": "name:{value:\"智能体\",original:\"Agent\"}"
  },
  // 7. Fast / Slow 速度项文字汉化 (main.js)
  {
    "old": "resolveOptionToString:t=>{switch(t){case sW.FAST:return\"Fast\";case sW.SLOW:return\"Slow\";default:return\"Fast\"}}",
    "new": "resolveOptionToString:t=>{switch(t){case sW.FAST:return\"快\";case sW.SLOW:return\"慢\";default:return\"快\"}}"
  },
  // 8. Fast / Slow 速度项文字汉化 (workbench.desktop.main.js)
  {
    "old": "resolveOptionToString:e=>{switch(e){case SBe.FAST:return\"Fast\";case SBe.SLOW:return\"Slow\";default:return\"Fast\"}}",
    "new": "resolveOptionToString:e=>{switch(e){case SBe.FAST:return\"快\";case SBe.SLOW:return\"慢\";default:return\"快\"}}"
  },
  // 9. Fast / Slow 下拉选项汉化 (workbench.desktop.main.js)
  {
    "old": "options:[{label:\"Slow\",value:Fwe.SLOW},{label:\"Fast\",value:Fwe.FAST,isDefaultWhenAvailable:!0}]",
    "new": "options:[{label:\"慢\",value:Fwe.SLOW},{label:\"快\",value:Fwe.FAST,isDefaultWhenAvailable:!0}]"
  },
  // 10. Limited time 额度显示文字汉化 (main.js)
  {
    "old": "if(!e||e<=new Date)return\"Quota Available\";",
    "new": "if(!e||e<=new Date)return\"额度可用\";"
  },
  // 11. Limited time 额度显示剩余时间刷新文字汉化 (main.js)
  {
    "old": "return n>0?`Refreshes in ${n} day${n>1?\"s\":\"\"}, ${a} hour${a>1?\"s\":\"\"}`:a>0?`Refreshes in ${a} hour${a>1?\"s\":\"\"}, ${i} minute${i>1?\"s\":\"\"}`:`Refreshes in ${i} minute${i>1?\"s\":\"\"}`",
    "new": "return n>0?`在 ${n} 天 ${a} 小时内刷新`:a>0?`在 ${a} 小时 ${i} 分钟内刷新`:`在 ${i} 分钟内刷新`"
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
