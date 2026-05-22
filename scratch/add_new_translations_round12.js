import fs from 'fs';
import path from 'path';

const translationsPath = 'translations.json';
if (!fs.existsSync(translationsPath)) {
  console.error('translations.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const newEntries = [
  // 1. Mr.ARTIFACT_REVIEW_MODE
  {
    "old": "[Mr.ARTIFACT_REVIEW_MODE,{isProviderSetting:!0,screen:\"Permissions\",label:\"Review Policy\",description:\"Specifies Agent's behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.\",options:$1t.map(t=>t.value),resolveOptionToString:t=>$1t.find(r=>r.value===t)?.label||\"Request Review\",resolveOptionToDescription:t=>{switch(t){case e0.TURBO:return\"Agent never asks for review. This maximizes the autonomy of the Agent, but also has the highest risk of the Agent operating over unsafe or injected Artifact content.\";case e0.ALWAYS:return\"Agent always asks for review.\";default:return\"\"}},settingType:\"dropdown\"}]",
    "new": "[Mr.ARTIFACT_REVIEW_MODE,{isProviderSetting:!0,screen:\"Permissions\",label:\"产物审核策略\",description:\"指定智能体在请求审核产物时的行为，产物是它创建的用于提供更丰富对话体验的文档。\",options:$1t.map(t=>t.value),resolveOptionToString:t=>$1t.find(r=>r.value===t)?.label||\"每次询问\",resolveOptionToDescription:t=>{switch(t){case e0.TURBO:return\"智能体从不请求审核。这最大化了智能体的自主性，但也有智能体在不安全或被注入的产物内容上运行的最高风险。\";case e0.ALWAYS:return\"智能体总是请求审核。\";default:return\"\"}},settingType:\"dropdown\"}]"
  },
  // 2. Mr.ENABLE_SOUNDS_FOR_SPECIAL_EVENTS
  {
    "old": "[Mr.ENABLE_SOUNDS_FOR_SPECIAL_EVENTS,{isProviderSetting:!0,screen:\"Permissions\",label:\"Enable Sounds for Agent\",description:\"When enabled, Antigravity will play a sound when Agent finishes generating a response.\",settingType:\"switch\"}]",
    "new": "[Mr.ENABLE_SOUNDS_FOR_SPECIAL_EVENTS,{isProviderSetting:!0,screen:\"Permissions\",label:\"启用智能体声音提示\",description:\"启用后，当智能体完成生成响应时，Antigravity 将播放提示音。\",settingType:\"switch\"}]"
  },
  // 3. Mr.ENABLE_AUTO_EXPAND_TOOLBAR
  {
    "old": "[Mr.ENABLE_AUTO_EXPAND_TOOLBAR,{isProviderSetting:!0,screen:\"Permissions\",label:\"Auto-Expand Changes Overview\",description:\"When enabled, the Changes Overview toolbar will automatically expand when Agent finishes generating a response.\",settingType:\"switch\"}]",
    "new": "[Mr.ENABLE_AUTO_EXPAND_TOOLBAR,{isProviderSetting:!0,screen:\"Permissions\",label:\"自动展开更改概览\",description:\"启用后，当智能体完成生成响应时，更改概览工具栏将自动展开。\",settingType:\"switch\"}]"
  },
  // 4. Mr.ENTERPRISE_GCP_PROJECT_ID
  {
    "old": "[Mr.ENTERPRISE_GCP_PROJECT_ID,{isProviderSetting:!0,screen:\"Permissions\",label:\"[Dev] GCP Project ID\",description:\"GCP Project ID for enterprise features.\",settingType:\"text\",placeholder:\"my-gcp-project-id\",type:\"string\"}]",
    "new": "[Mr.ENTERPRISE_GCP_PROJECT_ID,{isProviderSetting:!0,screen:\"Permissions\",label:\"[Dev] GCP 项目 ID\",description:\"企业功能所需的 GCP 项目 ID。\",settingType:\"text\",placeholder:\"my-gcp-project-id\",type:\"string\"}]"
  },
  // 5. Mr.CONVERSATION_HISTORY_ENABLED
  {
    "old": "[Mr.CONVERSATION_HISTORY_ENABLED,{isProviderSetting:!0,screen:\"Permissions\",label:\"Conversation History\",description:\"When enabled, the agent will be able to access past conversations to inform its responses.\",settingType:\"switch\"}]",
    "new": "[Mr.CONVERSATION_HISTORY_ENABLED,{isProviderSetting:!0,screen:\"Permissions\",label:\"历史对话\",description:\"启用后，智能体将能够访问过去的对话来提供更准确的响应。\",settingType:\"switch\"}]"
  },
  // 6. Mr.KNOWLEDGE_ENABLED
  {
    "old": "[Mr.KNOWLEDGE_ENABLED,{isProviderSetting:!0,screen:\"Permissions\",label:\"Knowledge\",description:\"When enabled, the agent will be able to access its knowledge base to inform its responses and automatically generate knowledge items in the background. Disabling this will prevent the agent from accessing existing knowledge items, but will not delete them.\",settingType:\"switch\"}]",
    "new": "[Mr.KNOWLEDGE_ENABLED,{isProviderSetting:!0,screen:\"Permissions\",label:\"知识库\",description:\"启用后，智能体将能够访问其知识库以辅助生成响应并在后台自动生成知识项。禁用此项将阻止智能体访问已有的知识项，但不会删除它们。\",settingType:\"switch\"}]"
  },
  // 7. Mr.DISABLE_AUTO_OPEN_EDITED_FILES
  {
    "old": "[Mr.DISABLE_AUTO_OPEN_EDITED_FILES,{isProviderSetting:!0,screen:\"Permissions\",label:\"Auto-Open Edited Files\",description:\"Open files in the background if Agent creates or edits them\",settingType:\"switch\"}]",
    "new": "[Mr.DISABLE_AUTO_OPEN_EDITED_FILES,{isProviderSetting:!0,screen:\"Permissions\",label:\"自动打开已编辑的文件\",description:\"若智能体创建或编辑了文件，则在后台自动打开它们\",settingType:\"switch\"}]"
  },
  // 8. Mr.DISABLE_OPEN_CASCADE_ON_RELOAD
  {
    "old": "[Mr.DISABLE_OPEN_CASCADE_ON_RELOAD,{isProviderSetting:!0,screen:\"Permissions\",label:\"Open Agent on Reload\",description:\"Open Agent panel on window reload\",settingType:\"switch\"}]",
    "new": "[Mr.DISABLE_OPEN_CASCADE_ON_RELOAD,{isProviderSetting:!0,screen:\"Permissions\",label:\"重载时打开智能体\",description:\"窗口重新加载时自动打开智能体面板\",settingType:\"switch\"}]"
  },
  // 9. Mr.VERBOSE_AGENT_CHAT
  {
    "old": "[Mr.VERBOSE_AGENT_CHAT,{isProviderSetting:!0,screen:\"Appearance\",label:\"Verbose agent chat\",description:\"Display and preserve intermediate thinking steps\",settingType:\"switch\"}]",
    "new": "[Mr.VERBOSE_AGENT_CHAT,{isProviderSetting:!0,screen:\"Appearance\",label:\"详细智能体对话\",description:\"显示并保留中间思考步骤\",settingType:\"switch\"}]"
  },
  // 10. Mr.TAB_ENABLED
  {
    "old": "[Mr.TAB_ENABLED,{isProviderSetting:!0,screen:\"Tab\",label:\"Suggestions in Editor\",description:\"Show suggestions when typing in the editor\",settingType:\"switch\"}]",
    "new": "[Mr.TAB_ENABLED,{isProviderSetting:!0,screen:\"Tab\",label:\"编辑器内提示\",description:\"在编辑器中键入时显示 AI 提示\",settingType:\"switch\"}]"
  },
  // 11. Mr.TAB_TO_JUMP
  {
    "old": "[Mr.TAB_TO_JUMP,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab to Jump\",description:\"Predict the location of your next edit and navigates you there with a tab keypress.\",settingType:\"switch\"}]",
    "new": "[Mr.TAB_TO_JUMP,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 键跳转\",description:\"预测下一个编辑位置，并在按下 Tab 键时导航至该处。\",settingType:\"switch\"}]"
  },
  // 12. Mr.DISABLE_TAB_TO_IMPORT
  {
    "old": "[Mr.DISABLE_TAB_TO_IMPORT,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab to Import\",description:\"Quickly add and update imports with a tab keypress.\",settingType:\"switch\"}]",
    "new": "[Mr.DISABLE_TAB_TO_IMPORT,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 键导入\",description:\"在按下 Tab 键时快速添加和更新导入项。\",settingType:\"switch\"}]"
  },
  // 13. Mr.AUTOCOMPLETE_SPEED
  {
    "old": "[Mr.AUTOCOMPLETE_SPEED,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab Speed\",description:\"Set the speed of tab suggestions\",settingType:\"dropdown\",options:[sW.FAST,sW.SLOW],resolveOptionToString:t=>{switch(t){case sW.FAST:return\"Fast\";case sW.SLOW:return\"Slow\";default:return\"Fast\"}}}]",
    "new": "[Mr.AUTOCOMPLETE_SPEED,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 速度\",description:\"设置 Tab 键提示的速度\",settingType:\"dropdown\",options:[sW.FAST,sW.SLOW],resolveOptionToString:t=>{switch(t){case sW.FAST:return\"快\";case sW.SLOW:return\"慢\";default:return\"快\"}}}]"
  },
  // 14. Mr.DISABLE_HIGHLIGHT_AFTER_ACCEPT
  {
    "old": "[Mr.DISABLE_HIGHLIGHT_AFTER_ACCEPT,{isProviderSetting:!0,screen:\"Tab\",label:\"Highlight After Accept\",description:\"Highlight newly inserted text after accepting a Tab completion.\",settingType:\"switch\"}]",
    "new": "[Mr.DISABLE_HIGHLIGHT_AFTER_ACCEPT,{isProviderSetting:!0,screen:\"Tab\",label:\"采纳提示后高亮\",description:\"在采纳 Tab 自动补全后高亮新插入的文本。\",settingType:\"switch\"}]"
  },
  // 15. Mr.ALLOW_TAB_ACCESS_GITIGNORE_FILES
  {
    "old": "[Mr.ALLOW_TAB_ACCESS_GITIGNORE_FILES,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab Gitignore Access\",description:\"Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.\",settingType:\"switch\"}]",
    "new": "[Mr.ALLOW_TAB_ACCESS_GITIGNORE_FILES,{isProviderSetting:!0,screen:\"Tab\",label:\"Tab 访问 Gitignore 文件\",description:\"允许 Tab 查看和编辑 .gitignore 中的文件。如果您的 .gitignore 列出了包含凭据、密钥或其他敏感信息的文件，请谨慎使用。\",settingType:\"switch\"}]"
  },
  // 16. Mr.AGENT_BROWSER_TOOLS
  {
    "old": "[Mr.AGENT_BROWSER_TOOLS,{isProviderSetting:!0,screen:\"Browser\",label:\"Enable Browser Tools\",description:\"When enabled, Agent can use browser tools to open URLs, read web pages, and interact with browser content. This allows the Agent access to important (and often critical) knowledge and methods of validation, but any browser integration does increase exposure to external malicious parties for security exploits.\",settingType:\"switch\"}]",
    "new": "[Mr.AGENT_BROWSER_TOOLS,{isProviderSetting:!0,screen:\"Browser\",label:\"启用浏览器工具\",description:\"启用后，智能体可以使用浏览器工具打开 URL、读取网页并与浏览器内容交互。这使智能体能够访问重要（通常是关键）的知识和验证方法，但任何 browser 集成确实会增加暴露给外部恶意方以进行安全漏洞利用的风险。\",settingType:\"switch\"}]"
  },
  // 17. Mr.BROWSER_JS_EXECUTION_POLICY
  {
    "old": "[Mr.BROWSER_JS_EXECUTION_POLICY,{isProviderSetting:!0,screen:\"Browser\",label:\"Browser Javascript Execution Policy\",description:\"Controls whether the agent can run custom JavaScript to automate complex browser actions.\",options:[vh.DISABLED,vh.ALWAYS_ASK,vh.TURBO],resolveOptionToString:t=>{switch(t){case vh.DISABLED:return\"Disabled\";case vh.ALWAYS_ASK:return\"Request Review\";case vh.TURBO:return\"Always Proceed\";default:return\"Request Review\"}},resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return\"Block all browser JavaScript execution.\";case vh.ALWAYS_ASK:return\"Prompt for approval before running browser scripts.\";case vh.TURBO:return\"Allow full browser script execution without prompting.\";default:return\"Prompt for approval before running browser scripts.\"}},settingType:\"dropdown\"}]",
    "new": "[Mr.BROWSER_JS_EXECUTION_POLICY,{isProviderSetting:!0,screen:\"Browser\",label:\"浏览器 Javascript 执行策略\",description:\"控制智能体是否可以运行自定义 JavaScript 来自动执行复杂的浏览器操作。\",options:[vh.DISABLED,vh.ALWAYS_ASK,vh.TURBO],resolveOptionToString:t=>{switch(t){case vh.DISABLED:return\"已禁用\";case vh.ALWAYS_ASK:return\"需要审核\";case vh.TURBO:return\"始终执行\";default:return\"需要审核\"}},resolveOptionToDescription:t=>{switch(t){case vh.DISABLED:return\"阻止所有浏览器 JavaScript 执行。\";case vh.ALWAYS_ASK:return\"在运行浏览器脚本前提示审核。\";case vh.TURBO:return\"允许完全执行浏览器脚本而无需提示。\";default:return\"在运行浏览器脚本前提示审核。\"}},settingType:\"dropdown\"}]"
  },
  // 18. Mr.BROWSER_CHROME_PATH
  {
    "old": "[Mr.BROWSER_CHROME_PATH,{isProviderSetting:!0,screen:\"Browser\",label:\"Chrome Binary Path\",description:\"Path to the Chrome/Chromium executable. Leave empty for auto-detection.\",settingType:\"text\",placeholder:\"Absolute path to the Chrome/Chromium executable\",type:\"string\"}]",
    "new": "[Mr.BROWSER_CHROME_PATH,{isProviderSetting:!0,screen:\"Browser\",label:\"Chrome 二进制文件路径\",description:\"指向 Chrome/Chromium 可执行文件的路径。留空以进行自动检测。\",settingType:\"text\",placeholder:\"指向 Chrome/Chromium 可执行文件的绝对路径\",type:\"string\"}]"
  },
  // 19. Mr.BROWSER_USER_PROFILE_PATH
  {
    "old": "[Mr.BROWSER_USER_PROFILE_PATH,{isProviderSetting:!0,screen:\"Browser\",label:\"Browser User Profile Path\",description:\"Custom path for the browser user profile directory. Leave empty for default (~/.gemini/antigravity-browser-profile).\",settingType:\"text\",placeholder:\"~/.gemini/antigravity-browser-profile\",type:\"string\"}]",
    "new": "[Mr.BROWSER_USER_PROFILE_PATH,{isProviderSetting:!0,screen:\"Browser\",label:\"浏览器用户配置文件路径\",description:\"浏览器用户配置文件目录的自定义路径。留空以使用默认路径 (~/.gemini/antigravity-browser-profile)。\",settingType:\"text\",placeholder:\"~/.gemini/antigravity-browser-profile\",type:\"string\"}]"
  },
  // 20. Pattern 0 (jetskiAgent)
  {
    "old": "getRenderInfo(){let e=this.type===0?\"Files\":this.type===1?\"Directories\":\"Code Context Items\",t=this.type===0?p(Trt,{size:14}):this.type===1?p(PBr,{size:14}):p(ldi",
    "new": "getRenderInfo(){let e=this.type===0?\"文件\":this.type===1?\"文件夹\":\"代码上下文项\",t=this.type===0?p(Trt,{size:14}):this.type===1?p(PBr,{size:14}):p(ldi"
  },
  // 21. Pattern 1 (workbench)
  {
    "old": "getRenderInfo(){let t=this.type===0?\"Files\":this.type===1?\"Directories\":\"Code Context Items\",e=this.type===0?R(msn,{size:14}):this.type===1?R(Xio,{size:14}):R(HJc",
    "new": "getRenderInfo(){let t=this.type===0?\"文件\":this.type===1?\"文件夹\":\"代码上下文项\",e=this.type===0?R(msn,{size:14}):this.type===1?R(Xio,{size:14}):R(HJc"
  },
  // 22. Pattern 2 (settings button in jetskiAgent)
  {
    "old": "p(zB,{icon:{type:\"googleSymbol\",name:\"settings\"},text:\"Settings\",onClick:()=>{e(ds.SETTINGS_OPEN,G0.SETTINGS),n(a?{targetProjectId:a}:void 0)},tooltipText:\"Settings\",tooltipKeybinding:sA.openSettings.keybindings,\"data-testid\":\"settings-button\"})",
    "new": "p(zB,{icon:{type:\"googleSymbol\",name:\"settings\"},text:\"设置\",onClick:()=>{e(ds.SETTINGS_OPEN,G0.SETTINGS),n(a?{targetProjectId:a}:void 0)},tooltipText:\"设置\",tooltipKeybinding:sA.openSettings.keybindings,\"data-testid\":\"settings-button\"})"
  },
  // 23. Pattern 3 (settings button in workbench)
  {
    "old": "R(qAe,{icon:{type:\"googleSymbol\",name:\"settings\"},text:\"Settings\",onClick:()=>{t(Mu.SETTINGS_OPEN,TN.SETTINGS),n(r?{targetProjectId:r}:void 0)},tooltipText:\"Settings\",tooltipKeybinding:dAe.openSettings.keybindings,\"data-testid\":\"settings-button\"})",
    "new": "R(qAe,{icon:{type:\"googleSymbol\",name:\"settings\"},text:\"设置\",onClick:()=>{t(Mu.SETTINGS_OPEN,TN.SETTINGS),n(r?{targetProjectId:r}:void 0)},tooltipText:\"设置\",tooltipKeybinding:dAe.openSettings.keybindings,\"data-testid\":\"settings-button\"})"
  },
  // 24. Pattern 4 (settings tab labels)
  {
    "old": "ZJd={[LYe.Settings]:{create:(t,e)=>t.get(be).createInstance(Wtr,e),label:\"Settings\"},[LYe.Keybindings]:{create:(t,e)=>t.get(be).createInstance(Gtr,e),label:\"AI Shortcuts\"}}",
    "new": "ZJd={[LYe.Settings]:{create:(t,e)=>t.get(be).createInstance(Wtr,e),label:\"设置\"},[LYe.Keybindings]:{create:(t,e)=>t.get(be).createInstance(Gtr,e),label:\"AI 快捷键\"}}"
  },
  // 25. Agent display values
  {
    "old": "title:{value:\"Agent\",original:\"Agent\"}",
    "new": "title:{value:\"智能体\",original:\"Agent\"}"
  },
  {
    "old": "name:{value:\"Agent\",original:\"Agent\"}",
    "new": "name:{value:\"智能体\",original:\"Agent\"}"
  },
  {
    "old": "className:\"text-muted-foreground\",children:\"Agent\"",
    "new": "className:\"text-muted-foreground\",children:\"智能体\""
  },
  {
    "old": "[cW.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"Agent\"}",
    "new": "[cW.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"智能体\"}"
  },
  {
    "old": "[wBe.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"Agent\"}",
    "new": "[wBe.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"智能体\"}"
  },
  // 26. _getSettingsItems main method
  {
    "old": "_getSettingsItems(){const e=[{isUssSetting:!0,label:\"Tab Speed\",type:E1e.Enum,description:[\"Set the speed of tab suggestions\"],topic:\"uss-tabPreferences\",options:[{label:\"Slow\",value:Fwe.SLOW},{label:\"Fast\",value:Fwe.FAST,isDefaultWhenAvailable:!0}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>YBo(i),generateSettingUpdate:i=>QBo(i)},{isUssSetting:!0,label:\"Auto-Open Edited Files\",type:E1e.Boolean,description:[\"Open files in the background if the agent creates or edits them\"],topic:\"uss-agentPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],category:U3.CASCADE_CONFIGURATION,resolveTopicToValue:i=>!j3a(i),generateSettingUpdate:i=>J3a(!i)},{isUssSetting:!0,label:\"Open Agent on Reload\",type:E1e.Boolean,description:[\"Open Agent panel on window reload\"],topic:\"uss-agentPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],category:U3.CASCADE_CONFIGURATION,resolveTopicToValue:i=>Vtr(i),generateSettingUpdate:i=>q3a(i)},{isUssSetting:!0,label:\"Tab to Jump\",type:E1e.Enum,description:[\"Predict the location of your next edit and navigates you there with a tab keypress\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:Ene.DISABLED},{label:E2.ON,value:Ene.ENABLED,description:\"Enable navigation suggestions that predict your next edit\",isDefaultWhenAvailable:!0}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>GBo(i),generateSettingUpdate:i=>jBo(i)},{isUssSetting:!0,label:\"Auto Execution\",type:E1e.Enum,description:[\"Always Proceed - Agent never asks for confirmation before executing terminal commands (except those in the Deny List)\",\"Request Review - Agent always asks for confirmation before executing terminal commands (except those in the Allow List)\"],topic:\"uss-agentPreferences\",options:[{label:\"Always Proceed\",value:$U.EAGER,description:\"Always auto-execute commands unless they are in your deny list. This also allows Agent to auto-execute Browser controls.\"},{label:\"Request Review\",value:$U.OFF,description:\"Never auto-execute commands unless they are in your allow list.\",isDefaultWhenAvailable:!0}],category:U3.CASCADE_CONFIGURATION,statusBarCategory:W7.CASCADE,overrideSentinelKey:fw.TERMINAL_AUTO_EXECUTION_POLICY,resolveTopicToValue:J2n,generateSettingUpdate:npt},{isUssSetting:!0,label:\"Review Policy\",type:E1e.Enum,description:[\"Always Proceed - Trust the agent to do tasks end-to-end\",\"Agent Decides - Assist the agent to complete tasks\",\"Request Review - Collaborate with the agent to complete tasks\"],topic:\"uss-agentPreferences\",options:[{label:\"Always Proceed\",value:Q9.TURBO,description:\"Trust the agent to do tasks end-to-end\",isDefaultWhenAvailable:!0},{label:\"Agent Decides\",value:Q9.AUTO,description:\"Assist the agent to complete tasks\"},{label:\"Request Review\",value:Q9.ALWAYS,description:\"Collaborate with the agent to complete tasks\"}],category:U3.CASCADE_CONFIGURATION,statusBarCategory:W7.CASCADE,overrideSentinelKey:fw.ARTIFACT_REVIEW_POLICY,resolveTopicToValue:j2n,generateSettingUpdate:ipt},{isUssSetting:!0,label:\"Suggestions in Editor\",description:[\"Show AI autocomplete suggestions in the editor\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:Jhe.OFF},{label:E2.ON,value:Jhe.ON}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>WBo(i),generateSettingUpdate:i=>HBo(i)},{isUssSetting:!0,label:\"Tab Gitignore Access\",description:[\"Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!1},{label:E2.ON,value:!0}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>YZt(i),generateSettingUpdate:i=>j1n(i)},{isUssSetting:!0,category:U3.CASCADE_CONFIGURATION,statusBarCategory:W7.CASCADE,label:\"Agent Auto-Fix Lints\",description:[\"When enabled, Agent is given awareness of lint errors created by its edits and may fix them without explicit user prompting. Note that this may increase Agent's tool usage.\"],topic:\"uss-agentPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],resolveTopicToValue:i=>z3a(i),generateSettingUpdate:i=>Q3a(i)},{isUssSetting:!0,category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,label:\"Tab to Import\",description:[\"Quickly add and update imports with a tab keypress.\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],resolveTopicToValue:i=>ZBo(i),generateSettingUpdate:i=>KBo(i)},{isUssSetting:!0,category:U3.ANTIGRAVITY_TAB,label:\"Highlight After Accept\",description:[\"Highlight newly inserted text after accepting a Tab completion.\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],resolveTopicToValue:i=>XBo(i),generateSettingUpdate:i=>zBo(i)}];return Xsc(this.contextKeyService)&&e.push({isUssSetting:!0,category:U3.ANTIGRAVITY_TAB,label:\"Enable Tab Sounds (Beta)\",description:[\"Turn this on for some sick beats. The more Tab suggestions you accept in a row, the better.\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!1},{label:E2.ON,value:!0}],resolveTopicToValue:i=>Yku(i),generateSettingUpdate:i=>Hku(i)}),e}",
    "new": "_getSettingsItems(){const e=[{isUssSetting:!0,label:\"Tab 速度\",type:E1e.Enum,description:[\"设置 Tab 键提示的速度\"],topic:\"uss-tabPreferences\",options:[{label:\"慢\",value:Fwe.SLOW},{label:\"快\",value:Fwe.FAST,isDefaultWhenAvailable:!0}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>YBo(i),generateSettingUpdate:i=>QBo(i)},{isUssSetting:!0,label:\"自动打开已编辑的文件\",type:E1e.Boolean,description:[\"若智能体创建或编辑了文件，则在后台自动打开它们\"],topic:\"uss-agentPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],category:U3.CASCADE_CONFIGURATION,resolveTopicToValue:i=>!j3a(i),generateSettingUpdate:i=>J3a(!i)},{isUssSetting:!0,label:\"重载时打开智能体\",type:E1e.Boolean,description:[\"窗口重新加载时自动打开智能体面板\"],topic:\"uss-agentPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],category:U3.CASCADE_CONFIGURATION,resolveTopicToValue:i=>Vtr(i),generateSettingUpdate:i=>q3a(i)},{isUssSetting:!0,label:\"Tab 键跳转\",type:E1e.Enum,description:[\"预测下一个编辑位置，并在按下 Tab 键时导航至该处\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:Ene.DISABLED},{label:E2.ON,value:Ene.ENABLED,description:\"启用预测您下一个编辑位置的导航提示\",isDefaultWhenAvailable:!0}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>GBo(i),generateSettingUpdate:i=>jBo(i)},{isUssSetting:!0,label:\"终端命令自动执行\",type:E1e.Enum,description:[\"始终执行 - 智能体在执行终端命令前从不请求确认（排除列表中的命令除外）\",\"需要审核 - 智能体在执行终端命令前总是请求确认（允许列表中的命令除外）\"],topic:\"uss-agentPreferences\",options:[{label:\"始终执行\",value:$U.EAGER,description:\"始终自动执行命令，除非它们在您的排除列表中。这也允许智能体自动执行浏览器控制。\"},{label:\"需要审核\",value:$U.OFF,description:\"从不自动执行命令，除非它们在您的允许列表中。\",isDefaultWhenAvailable:!0}],category:U3.CASCADE_CONFIGURATION,statusBarCategory:W7.CASCADE,overrideSentinelKey:fw.TERMINAL_AUTO_EXECUTION_POLICY,resolveTopicToValue:J2n,generateSettingUpdate:npt},{isUssSetting:!0,label:\"产物审核策略\",type:E1e.Enum,description:[\"始终执行 - 信任智能体端到端地完成任务\",\"智能体决定 - 辅助智能体完成任务\",\"需要审核 - 与智能体协作完成任务\"],topic:\"uss-agentPreferences\",options:[{label:\"始终执行\",value:Q9.TURBO,description:\"信任智能体端到端地完成任务\",isDefaultWhenAvailable:!0},{label:\"智能体决定\",value:Q9.AUTO,description:\"辅助智能体完成任务\"},{label:\"需要审核\",value:Q9.ALWAYS,description:\"与智能体协作完成任务\"}],category:U3.CASCADE_CONFIGURATION,statusBarCategory:W7.CASCADE,overrideSentinelKey:fw.ARTIFACT_REVIEW_POLICY,resolveTopicToValue:j2n,generateSettingUpdate:ipt},{isUssSetting:!0,label:\"编辑器内提示\",description:[\"在编辑器中显示 AI 自动补全提示\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:Jhe.OFF},{label:E2.ON,value:Jhe.ON}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>WBo(i),generateSettingUpdate:i=>HBo(i)},{isUssSetting:!0,label:\"Tab 访问 Gitignore 文件\",description:[\"允许 Tab 查看和编辑 .gitignore 中的文件。如果您的 .gitignore 列出了包含凭据、密钥或其他敏感信息的文件，请谨慎使用。\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!1},{label:E2.ON,value:!0}],category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,resolveTopicToValue:i=>YZt(i),generateSettingUpdate:i=>j1n(i)},{isUssSetting:!0,category:U3.CASCADE_CONFIGURATION,statusBarCategory:W7.CASCADE,label:\"智能体自动修复 Lint 错误\",description:[\"启用后，智能体将能够感知由其编辑所创建的 lint 错误，并可能在没有用户显式提示的情况下修复它们。请注意，这可能会增加智能体对工具的使用。\"],topic:\"uss-agentPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],resolveTopicToValue:i=>z3a(i),generateSettingUpdate:i=>Q3a(i)},{isUssSetting:!0,category:U3.ANTIGRAVITY_TAB,statusBarCategory:W7.ANTIGRAVITY_TAB,label:\"Tab 键导入\",description:[\"在按下 Tab 键时快速添加和更新导入项。\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],resolveTopicToValue:i=>ZBo(i),generateSettingUpdate:i=>KBo(i)},{isUssSetting:!0,category:U3.ANTIGRAVITY_TAB,label:\"采纳提示后高亮\",description:[\"在采纳 Tab 自动补全后高亮新插入的文本。\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!0},{label:E2.ON,value:!1}],resolveTopicToValue:i=>XBo(i),generateSettingUpdate:i=>zBo(i)}];return Xsc(this.contextKeyService)&&e.push({isUssSetting:!0,category:U3.ANTIGRAVITY_TAB,label:\"启用 Tab 声音提示（公测版）\",description:[\"开启此项以体验动感音效。连续采纳的 Tab 提示越多，效果越好。\"],topic:\"uss-tabPreferences\",options:[{label:E2.OFF,value:!1},{label:E2.ON,value:!0}],resolveTopicToValue:i=>Yku(i),generateSettingUpdate:i=>Hku(i)}),e}"
  },
  // 27. Past Conversations
  {
    "old": "id:\"history-tooltip\",place:\"bottom-end\",children:\"Past Conversations\"",
    "new": "id:\"history-tooltip\",place:\"bottom-end\",children:\"历史对话\""
  },
  // 28. Additional Options
  {
    "old": "id:f,place:\"bottom-end\",children:\"Additional Options\"",
    "new": "id:f,place:\"bottom-end\",children:\"更多选项\""
  },
  // 29. Close Agent View
  {
    "old": "id:h,place:\"bottom-end\",children:\"Close Agent View\"",
    "new": "id:h,place:\"bottom-end\",children:\"关闭智能体视图\""
  },
  // 30. AI may make mistakes. Double-check all generated code.
  {
    "old": "children:\"AI may make mistakes. Double-check all generated code.\"",
    "new": "children:\"AI 可能会犯错。请仔细检查生成的代码。\""
  },
  // 31. Record Audio / Stop Recording / Recording (z & H & ee & ne)
  {
    "old": "H=x?p(jt,{children:[\"Record Audio \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"Record Audio\",ee=x?p(jt,{children:[\"Stop Recording \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"Recording\"",
    "new": "H=x?p(jt,{children:[\"录制音频 \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"录制音频\",ee=x?p(jt,{children:[\"停止录音 \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"正在录音\""
  },
  {
    "old": "z=x?R(tn,{children:[\"Record Audio \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"Record Audio\",ne=x?R(tn,{children:[\"Stop Recording \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"Recording\"",
    "new": "z=x?R(tn,{children:[\"录制音频 \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"录制音频\",ne=x?R(tn,{children:[\"停止录音 \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"正在录音\""
  },
  // 32. Media / Mentions
  {
    "old": "label:\"Media\",onClick:Ye",
    "new": "label:\"媒体\",onClick:Ye"
  },
  {
    "old": "label:\"Mentions\",onClick:Wt",
    "new": "label:\"提及\",onClick:Wt"
  },
  {
    "old": "label:\"Media\",onClick:rt",
    "new": "label:\"媒体\",onClick:rt"
  },
  {
    "old": "label:\"Mentions\",onClick:Gi",
    "new": "label:\"提及\",onClick:Gi"
  }
];

let added = 0;
newEntries.forEach(entry => {
  if (!data.some(d => d.old === entry.old)) {
    data.push(entry);
    added++;
  }
});

console.log(`Added ${added} new translations.`);
fs.writeFileSync(translationsPath, JSON.stringify(data, null, 2), 'utf8');
