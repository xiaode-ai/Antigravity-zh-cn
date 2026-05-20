import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

// 1. 过滤掉原本冗余且没生效的 "By using this app" 长段匹配规则
translations = translations.filter(t => !t.old.includes('By using this app, you agree to its'));
console.log(`Cleaned up old 'By using this app' rules. Remaining count: ${translations.length}`);

// 2. 新定义 14 组精心打造的高精度汉化对照规则
const round3Entries = [
  // A. 条款中文化的最稳健匹配
  {
    "old": "\"By using this app, you agree to its\"",
    "new": "\"使用本应用即表示您同意其\""
  },
  // B. 高级设置标题
  {
    "old": "label:t=\"Advanced Settings\"",
    "new": "label:t=\"高级设置\""
  },
  // C. 演示模式开关与超长说明段落
  {
    "old": "[Mr.DEMO_MODE_ENABLED,{isProviderSetting:!0,screen:\"Permissions\",label:\"Enable Demo Mode (Beta)\",description:'When enabled, your UI will be slightly modified to ensure more consistent demos. This is only recommended for demo purposes. In most cases, you can run \"Antigravity: Start Demo Mode\" and \"Antigravity: Stop Demo Mode\" to control this switch and update your ~/.gemini/antigravity data directory.',settingType:\"switch\"}]",
    "new": "[Mr.DEMO_MODE_ENABLED,{isProviderSetting:!0,screen:\"Permissions\",label:\"启用演示模式（测试版）\",description:'启用后，您的 UI 将进行微调，以确保更一致的演示。这仅建议用于演示目的。在大多数情况下，您可以运行“Antigravity: Start Demo Mode”和“Antigravity: Stop Demo Mode”来控制此开关并更新 ~/.gemini/antigravity 数据目录。',settingType:\"switch\"}]"
  },
  // D. 自定义描述
  {
    "old": "title:\"Customizations\",description:p(\"span\",{children:[\"Configure default behaviors, skills, and MCP servers.\",",
    "new": "title:\"自定义设置\",description:p(\"span\",{children:[\"配置默认行为、技能和 MCP 服务端。\","
  },
  // E. 预算超额说明
  {
    "old": "children:\"The breakdown below shows token usage from customizations like skills, rules, and MCP. If the budget is exceeded, large customizations will be truncated automatically.\"",
    "new": "children:\"以下分析显示了来自技能、规则和 MCP 等自定义设置的 Token 使用情况。如果超出了预算额度，大型自定义内容将被自动截断。\""
  },
  // F. 可用预算比例展示
  {
    "old": "children:[u.toFixed(1),\"% of the customization budget is available.\"]",
    "new": "children:[u.toFixed(1),\"% 的自定义预算额度可用。\"]"
  },
  // G. 动态明细展示/折叠三元运算符
  {
    "old": "V?\"Hide breakdown\":`Show ${I.length} breakdown${I.length===1?\"\":\"s\"}`",
    "new": "V?\"隐藏明细\":`显示 ${I.length} 项明细`"
  },
  // H. MCP 无安装提示
  {
    "old": "children:[p(\"div\",{className:\"text-sm font-medium\",children:\"No MCP Servers\"}),p(\"div\",{className:\"text-sm text-muted-foreground max-w-sm\",children:[\"You currently don't have any MCP Servers installed.\",n.openConfigFile?\" Add an MCP server above or add a custom one via the MCP Config.\":\" Add an MCP server above\"]})]",
    "new": "children:[p(\"div\",{className:\"text-sm font-medium\",children:\"无 MCP 服务端\"}),p(\"div\",{className:\"text-sm text-muted-foreground max-w-sm\",children:[\"您当前未安装任何 MCP 服务端。\",n.openConfigFile?\" 请在上方添加一个 MCP 服务端，或通过 MCP 配置添加自定义配置。\":\" 请在上方添加一个 MCP 服务端\"]})]"
  },
  // I. Build With Google 插件列表配置与 Customize 按钮
  {
    "old": "title:\"Build With Google Plugins\",children:p(yo,{children:p(Wd,{label:\"Build With Google Plugins\",rightElement:p(lo,{onClick:()=>{j(\"bwg_plugins\")},children:\"Customize\"})})})",
    "new": "title:\"Build With Google 插件\",children:p(yo,{children:p(Wd,{label:\"Build With Google 插件\",rightElement:p(lo,{onClick:()=>{j(\"bwg_plugins\")},children:\"配置\"})})})"
  },
  // J. Build With Google 插件返回标题
  {
    "old": "children:\"Build With Google Plugins\"",
    "new": "children:\"Build With Google 插件\""
  },
  // K. 全局 / 工作区图标徽章 (Badge)
  {
    "old": "children:e?\"Global\":r&&t?t.length>15?t.substring(0,15)+\"\\u2026\":t:\"Workspace\"",
    "new": "children:e?\"全局\":r&&t?t.length>15?t.substring(0,15)+\"\\u2026\":t:\"工作区\""
  },
  // L. 规则大列表标题
  {
    "old": "p(Xgt,{title:\"Rules\",count:F.length})",
    "new": "p(Xgt,{title:\"规则\",count:F.length})"
  },
  // M. rules 菜单渲染 label 属性
  {
    "old": "getRenderInfo(){return{label:\"Rules\",icon:p(xrt,{size:14})}}",
    "new": "getRenderInfo(){return{label:\"规则\",icon:p(xrt,{size:14})}}"
  },
  // N. Token使用情况分类统计饼图图例动态匹配汉化 (Skills, Rules, MCP, System Prompt)
  {
    "old": "p(\"div\",{className:\"flex items-center gap-2\",children:[p(\"div\",{className:\"w-2 h-2 rounded-full shrink-0\",style:{backgroundColor:b.color}}),p(\"span\",{className:\"text-secondary-foreground\",children:b.label}),p(\"span\",{className:\"tabular-nums text-muted-foreground\",children:[n?`(${r(b.tokens).toFixed(1)}%) `:\"\",iFe(b.tokens)]})]})",
    "new": "p(\"div\",{className:\"flex items-center gap-2\",children:[p(\"div\",{className:\"w-2 h-2 rounded-full shrink-0\",style:{backgroundColor:b.color}}),p(\"span\",{className:\"text-secondary-foreground\",children:({\"Rules\":\"规则\",\"Skills\":\"技能\",\"MCP\":\"MCP 服务端\",\"System Prompt\":\"系统提示词\"}[b.label]||b.label)}),p(\"span\",{className:\"tabular-nums text-muted-foreground\",children:[n?`(${r(b.tokens).toFixed(1)}%) `:\"\",iFe(b.tokens)]})]})"
  }
];

translations.push(...round3Entries);
console.log(`Added ${round3Entries.length} new Round 3 entries. Total translations count now: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully applied Round 3 updates to translations.json!');
