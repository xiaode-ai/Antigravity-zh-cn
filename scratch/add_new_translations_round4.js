import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

const round4Entries = [
  // 1. 设置界面的栏目标题动态翻译
  {
    "old": "children:p(rRn,{title:\"General\"})",
    "new": "children:p(rRn,{title:\"常规\"})"
  },
  {
    "old": "title:\"Suggestions\",settings:",
    "new": "title:\"建议\",settings:"
  },
  {
    "old": "title:\"Navigation\",settings:",
    "new": "title:\"导航\",settings:"
  },
  {
    "old": "title:\"Context\",settings:",
    "new": "title:\"上下文\",settings:"
  },
  {
    "old": "title:\"General\",settings:",
    "new": "title:\"常规\",settings:"
  },
  {
    "old": "title:\"Advanced\",settings:",
    "new": "title:\"高级\",settings:"
  },
  // 2. 浏览器设置汉化
  {
    "old": "[Mr.AGENT_BROWSER_TOOLS,{isProviderSetting:!0,screen:\"Browser\",label:\"Enable Browser Tools\",description:\"When enabled, Agent can use browser tools to open URLs, read web pages, and interact with browser content. This allows the Agent access to important (and often critical) knowledge and methods of validation, but any browser integration does increase exposure to external malicious parties for security exploits.\",settingType:\"switch\"}]",
    "new": "[Mr.AGENT_BROWSER_TOOLS,{isProviderSetting:!0,screen:\"Browser\",label:\"启用浏览器工具\",description:\"启用后，智能体可以使用浏览器工具打开 URL、读取网页内容并与浏览器内容交互。这使得智能体能够获取重要的（通常是关键的）知识和验证方法，但任何浏览器集成都会增加遭受外部恶意方安全利用的风险。\",settingType:\"switch\"}]"
  },
  {
    "old": "label:\"Browser Javascript Execution Policy\",description:\"Controls whether the agent can run custom JavaScript to automate complex browser actions.\",options:[vh.DISABLED,vh.ALWAYS_ASK,vh.TURBO],resolveOptionToString:t=>{switch(t){case vh.DISABLED:return\"Disabled\";case vh.ALWAYS_ASK:return\"Request Review\";case vh.TURBO:return\"Always Proceed\";default:return\"Request Review\"}},resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return\"Block all browser JavaScript execution.\";case vh.ALWAYS_ASK:return\"Prompt for approval before running browser scripts.\";case vh.TURBO:return\"Allow full browser script execution without prompting.\";default:return\"Prompt for approval before running browser scripts.\"}}",
    "new": "label:\"浏览器 JavaScript 执行策略\",description:\"控制智能体是否可以运行自定义 JavaScript 以自动化复杂的浏览器操作。\",options:[vh.DISABLED,vh.ALWAYS_ASK,vh.TURBO],resolveOptionToString:t=>{switch(t){case vh.DISABLED:return\"已禁用\";case vh.ALWAYS_ASK:return\"需要审核\";case vh.TURBO:return\"始终执行\";default:return\"需要审核\"}},resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return\"阻止所有浏览器 JavaScript 执行。\";case vh.ALWAYS_ASK:return\"在运行浏览器脚本之前提示批准。\";case vh.TURBO:return\"允许完整的浏览器脚本执行而无需提示。\";default:return\"在运行浏览器脚本之前提示批准。\"}}"
  },
  // 3. Tab (Suggestions) 设置汉化
  {
    "old": "[Mr.TAB_ENABLED,{isProviderSetting:!0,screen:\"Tab\",label:\"Suggestions in Editor\",description:\"Show suggestions when typing in the editor\",settingType:\"switch\"}]",
    "new": "[Mr.TAB_ENABLED,{isProviderSetting:!0,screen:\"Tab\",label:\"在编辑器中显示建议\",description:\"在编辑器中键入时显示补全建议\",settingType:\"switch\"}]"
  },
  {
    "old": "label:\"Tab Speed\",description:\"Set the speed of tab suggestions\",settingType:\"dropdown\",options:[sW.FAST,sW.SLOW],resolveOptionToString:t=>{switch(t){case sW.FAST:return\"Fast\";case sW.SLOW:return\"Slow\";default:return\"Fast\"}}",
    "new": "label:\"建议速度\",description:\"设置 Tab 补全建议的显示速度\",settingType:\"dropdown\",options:[sW.FAST,sW.SLOW],resolveOptionToString:t=>{switch(t){case sW.FAST:return\"快速\";case sW.SLOW:return\"慢速\";default:return\"快速\"}}"
  },
  {
    "old": "[Mr.DISABLE_HIGHLIGHT_AFTER_ACCEPT,{isProviderSetting:!0,screen:\"Tab\",label:\"Highlight After Accept\",description:\"Highlight newly inserted text after accepting a Tab completion.\",settingType:\"switch\"}]",
    "new": "[Mr.DISABLE_HIGHLIGHT_AFTER_ACCEPT,{isProviderSetting:!0,screen:\"Tab\",label:\"接受后高亮\",description:\"在接受 Tab 补全后高亮显示新插入的文本。\",settingType:\"switch\"}]"
  },
  {
    "old": "[Mr.DISABLE_TAB_TO_IMPORT,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab to Import\",description:\"Quickly add and update imports with a tab keypress.\",settingType:\"switch\"}]",
    "new": "[Mr.DISABLE_TAB_TO_IMPORT,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 导入\",description:\"通过按下 Tab 键快速添加和更新代码导入 (Imports)。\",settingType:\"switch\"}]"
  },
  {
    "old": "[Mr.TAB_TO_JUMP,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab to Jump\",description:\"Predict the location of your next edit and navigates you there with a tab keypress.\",settingType:\"switch\"}]",
    "new": "[Mr.TAB_TO_JUMP,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 跳转\",description:\"预测您下一次编辑的位置，并通过按下 Tab 键导航到那里。\",settingType:\"switch\"}]"
  },
  {
    "old": "[Mr.ALLOW_TAB_ACCESS_GITIGNORE_FILES,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab Gitignore Access\",description:\"Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.\",settingType:\"switch\"}]",
    "new": "[Mr.ALLOW_TAB_ACCESS_GITIGNORE_FILES,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 访问 .gitignore\",description:\"允许 Tab 补全查看和编辑 .gitignore 中的文件。如果您的 .gitignore 列出了包含凭据、机密或其他敏感信息的文件，请谨慎使用。\",settingType:\"switch\"}]"
  },
  // 4. 编辑器设置汉化
  {
    "old": "title:\"Editor Settings\",description:\"Configure editor-specific behaviors and shortcuts.\"",
    "new": "title:\"编辑器设置\",description:\"配置编辑器特定的行为和快捷键。\""
  },
  {
    "old": "title:\"Marketplace\",children",
    "new": "title:\"扩展市场\",children"
  },
  {
    "old": "label:\"Marketplace Item URL\",description:`Changes the base URL on each extension page. You must restart ${t.nameShort} to use the new marketplace after changing this value.`,configurationKey:\"antigravity.marketplaceGalleryItemURL\"",
    "new": "label:\"扩展详情页 URL\",description:`更改每个扩展页面的基础 URL。更改此值后，您必须重新启动 ${t.nameShort} 才能使用新的扩展市场。`,configurationKey:\"antigravity.marketplaceGalleryItemURL\""
  },
  {
    "old": "label:\"Marketplace Gallery URL\",description:`Changes the base URL for marketplace search results. You must restart ${t.nameShort} to use the new marketplace after changing this value.`,configurationKey:\"antigravity.marketplaceExtensionGalleryServiceURL\"",
    "new": "label:\"扩展搜索结果 URL\",description:`更改扩展市场搜索结果的基础 URL。更改此值后，您必须重新启动 ${t.nameShort} 才能使用新的扩展市场。`,configurationKey:\"antigravity.marketplaceExtensionGalleryServiceURL\""
  },
  {
    "old": "[Mr.SHOW_SELECTION_POPUP,{isProviderSetting:!0,screen:\"Editor\",label:\"Show Selection Actions\",description:'Show \"Edit\" and \"Chat\" buttons when selecting text in the editor.',settingType:\"switch\"}]",
    "new": "[Mr.SHOW_SELECTION_POPUP,{isProviderSetting:!0,screen:\"Editor\",label:\"显示选中操作\",description:'在编辑器中选择文本时显示“编辑”和“对话”按钮。',settingType:\"switch\"}]"
  },
  {
    "old": "children:[p(\"div\",{className:\"text-sm font-medium\",children:\"Editor Settings\"}),p(\"div\",{className:\"text-xs text-muted-foreground mt-0.5\",children:\"To modify editor settings, open Settings within the editor window.\"})]}),p(Eo,{onClick:()=>e?.openEditorSettings(),children:\"Open Editor Settings\"})]})",
    "new": "children:[p(\"div\",{className:\"text-sm font-medium\",children:\"编辑器设置\"}),p(\"div\",{className:\"text-xs text-muted-foreground mt-0.5\",children:\"若要修改更详细的编辑器设置，请在编辑器窗口中打开自带的 VS Code 设置。\"})]}),p(Eo,{onClick:()=>e?.openEditorSettings(),children:\"打开编辑器设置\"})]})"
  }
];

translations.push(...round4Entries);
console.log(`Added ${round4Entries.length} new Round 4 entries. Total translations count now: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully applied Round 4 updates to translations.json!');
