import fs from 'fs';

const newTranslations = [
  {
    "old": "p(B2,{checked:e.includes(I.uid),onChange:()=>N(I.uid),alignTop:!0,label:p(\"span\",{className:\"font-medium text-sm\",children:I.name})})",
    "new": "p(B2,{checked:e.includes(I.uid),onChange:()=>N(I.uid),alignTop:!0,label:p(\"span\",{className:\"font-medium text-sm\",children:({\"Android\":\"Android\",\"Firebase\":\"Firebase\",\"Science\":\"科学 (Science)\",\"Chrome DevTools\":\"Chrome 开发者工具 (Chrome DevTools)\",\"Modern Web Guidance\":\"现代 Web 指南 (Modern Web Guidance)\",\"Google Antigravity SDK\":\"Google Antigravity SDK\"}[I.name]||I.name)})})"
  },
  {
    "old": "p(_n,{id:`plugin-desc-${I.uid}`,place:\"top\",children:p(\"div\",{className:\"max-w-[250px] text-xs leading-normal\",children:I.description})})",
    "new": "p(_n,{id:`plugin-desc-${I.uid}`,place:\"top\",children:p(\"div\",{className:\"max-w-[250px] text-xs leading-normal\",children:({\"Core tools and knowledge required to develop for Android\":\"开发 Android 所需的核心工具和知识。\",\"Keep your coding agent up to date with the latest web best practices.\":\"让您的编码智能体紧跟最新的 Web 最佳实践。\",\"Using the Antigravity Python SDK to build AI agents\":\"使用 Antigravity Python SDK 构建 AI 智能体。\",\"Curated collection of agent skills for science.\":\"专为科学任务精选的智能体技能合集。\",\"Curated collection of agent skills for science tasks.\":\"专为科学任务精选的智能体技能合集。\",\"Prototype, build & run modern apps users love with Firebase's backend, AI, and operational infrastructure.\":\"利用 Firebase 的后端、AI 和运营基础设施，原型设计、构建和运行深受用户喜爱的现代应用。\",\"Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer\":\"使用 Chrome DevTools 和 Puppeteer 在 Chrome 中实现可靠的自动化、深度调试和性能分析。\"}[I.description]||I.description)})})"
  },
  {
    "old": "p(\"div\",{className:\"flex flex-col\",children:[p(\"span\",{className:\"text-sm font-medium\",children:x.plugin?.name||D}),p(\"span\",{className:\"text-xs text-muted-foreground mt-0.5 line-clamp-2\",children:x.plugin?.description||\"No description available.\"})]})",
    "new": "p(\"div\",{className:\"flex flex-col\",children:[p(\"span\",{className:\"text-sm font-medium\",children:({\"Android\":\"Android\",\"Firebase\":\"Firebase\",\"Science\":\"科学 (Science)\",\"Chrome DevTools\":\"Chrome 开发者工具 (Chrome DevTools)\",\"Modern Web Guidance\":\"现代 Web 指南 (Modern Web Guidance)\",\"Google Antigravity SDK\":\"Google Antigravity SDK\"}[x.plugin?.name||D]||(x.plugin?.name||D))}),p(\"span\",{className:\"text-xs text-muted-foreground mt-0.5 line-clamp-2\",children:({\"Core tools and knowledge required to develop for Android\":\"开发 Android 所需的核心工具和知识。\",\"Keep your coding agent up to date with the latest web best practices.\":\"让您的编码智能体紧跟最新的 Web 最佳实践。\",\"Using the Antigravity Python SDK to build AI agents\":\"使用 Antigravity Python SDK 构建 AI 智能体。\",\"Curated collection of agent skills for science.\":\"专为科学任务精选的智能体技能合集。\",\"Curated collection of agent skills for science tasks.\":\"专为科学任务精选的智能体技能合集。\",\"Prototype, build & run modern apps users love with Firebase's backend, AI, and operational infrastructure.\":\"利用 Firebase 的后端、AI 和运营基础设施，原型设计、构建和运行深受用户喜爱的现代应用。\",\"Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer\":\"使用 Chrome DevTools 和 Puppeteer 在 Chrome 中实现可靠的自动化、深度调试和性能分析。\"}[x.plugin?.description]||(x.plugin?.description||\"暂无描述。\"))})]})"
  },
  {
    "old": "p(\"div\",{className:\"ml-4 flex-shrink-0\",children:U?p(lo,{disabled:w,onClick:()=>I(D),className:\"text-red-500 hover:bg-red-500/10 border-red-500/20\",children:w?\"Deleting...\":\"Delete\"}):p(Eo,{disabled:w,onClick:()=>V(D),children:w?\"Downloading...\":\"Download\"})})",
    "new": "p(\"div\",{className:\"ml-4 flex-shrink-0\",children:U?p(lo,{disabled:w,onClick:()=>I(D),className:\"text-red-500 hover:bg-red-500/10 border-red-500/20\",children:w?\"正在删除...\":\"删除\"}):p(Eo,{disabled:w,onClick:()=>V(D),children:w?\"正在下载...\":\"下载\"})})"
  },
  {
    "old": "p(\"div\",{className:\"font-medium text-lg\",children:\"Build with Google\"})",
    "new": "p(\"div\",{className:\"font-medium text-lg\",children:\"使用 Google 插件构建\"})"
  },
  {
    "old": "children:[\"Plugins are packaged collections of skills and MCPs to help the Agent\",\" \",a?`in ${a} `:\"\",\"work with Google developer products. You can always change your choices in Settings.\"]",
    "new": "children:[\"插件是技能和 MCP 的打包合集，旨在帮助智能体\",\" \",a?`在 ${a} 中 `:\"\",\"与 Google 开发者产品协同工作。您随时可以在设置中更改您的选择。\"]"
  },
  {
    "old": "children:[\"Plugins are packaged collections of skills and MCPs to help the Agent in \",e,\" work with Google developer products. You can always change your choices in Settings.\"]",
    "new": "children:[\"插件是技能和 MCP 的打包合集，旨在帮助 \",e,\" 中的智能体与 Google 开发者产品协同工作。您随时可以在设置中更改您的选择。\"]"
  },
  {
    "old": "children:\"No plugins available.\"",
    "new": "children:\"没有可用的插件。\""
  },
  {
    "old": "children:\"No Plugins Available\"",
    "new": "children:\"没有可用的插件\""
  },
  {
    "old": "children:[\"There are currently no Build with \",e,\" plugins available.\"]",
    "new": "children:[\"目前没有可用的 Build with \",e,\" 插件。\"]"
  }
];

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Filter out any duplicates if they exist, then push
newTranslations.forEach(newItem => {
  const exists = translations.some(existing => existing.old === newItem.old);
  if (!exists) {
    translations.push(newItem);
    console.log(`Added: ${newItem.old.substring(0, 50)}...`);
  } else {
    console.log(`Already exists, skipping: ${newItem.old.substring(0, 50)}...`);
  }
});

fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully updated translations.json!');
