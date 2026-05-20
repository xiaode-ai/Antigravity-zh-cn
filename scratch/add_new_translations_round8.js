import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`原始词条数: ${translations.length}`);

const newEntries = [
  // ========== 1. 设置摘要显示函数 - 将概览卡片中的 "Require Review"/"Proceed in Sandbox"/"Enabled"/"Disabled" 汉化 ==========
  {
    "old": "CASCADE_AUTO_EXECUTION_POLICY:return u===rl.EAGER?\"Always Proceed\":u===rl.OFF?\"Require Review\":\"Proceed in Sandbox\";case Mr.ALLOW_AGENT_ACCESS_NON_WORKSPACE_FILES:return C===Ju.ALLOW?\"Enabled\":\"Disabled\";default:return\"\"",
    "new": "CASCADE_AUTO_EXECUTION_POLICY:return u===rl.EAGER?\"始终执行\":u===rl.OFF?\"需要审核\":\"在沙箱中执行\";case Mr.ALLOW_AGENT_ACCESS_NON_WORKSPACE_FILES:return C===Ju.ALLOW?\"已启用\":\"已禁用\";default:return\"\""
  },

  // ========== 2. 浏览器 JS 选项数组 - 将 label:"Disabled"/"Ask first"/"Always run" 和 disabledReason 汉化 ==========
  {
    "old": "{value:vh.DISABLED,label:\"Disabled\",isAllowed:!0},{value:vh.ALWAYS_ASK,label:\"Ask first\",isAllowed:!e,disabledReason:\"JavaScript execution disabled in strict mode\"},{value:vh.TURBO,label:\"Always run\",isAllowed:!e,disabledReason:\"JavaScript execution disabled in strict mode\"}",
    "new": "{value:vh.DISABLED,label:\"已禁用\",isAllowed:!0},{value:vh.ALWAYS_ASK,label:\"先询问\",isAllowed:!e,disabledReason:\"在严格模式下 JavaScript 执行已禁用\"},{value:vh.TURBO,label:\"始终运行\",isAllowed:!e,disabledReason:\"在严格模式下 JavaScript 执行已禁用\"}"
  },

  // ========== 3. Chrome 二进制路径 - 描述和占位符 ==========
  {
    "old": "description:\"Path to the Chrome/Chromium executable. Leave empty for auto-detection.\",settingType:\"text\",placeholder:\"Absolute path to the Chrome/Chromium executable\"",
    "new": "description:\"Chrome/Chromium 可执行文件的路径。留空以使用自动检测。\",settingType:\"text\",placeholder:\"Chrome/Chromium 可执行文件的绝对路径\""
  },

  // ========== 4. 浏览器用户配置路径 - 标签和描述 ==========
  {
    "old": "label:\"Browser User Profile Path\",description:\"Custom path for the browser user profile directory. Leave empty for default (~/.gemini/antigravity-browser-profile).\"",
    "new": "label:\"浏览器用户配置路径\",description:\"浏览器用户配置目录的自定义路径。留空以使用默认路径 (~/.gemini/antigravity-browser-profile)。\""
  },

  // ========== 5. 浏览器 CDP 端口 - 标签和描述 ==========
  {
    "old": "label:\"Browser CDP Port\",description:\"Port number for Chrome DevTools Protocol remote debugging. Leave empty for default (9222).\"",
    "new": "label:\"浏览器 CDP 端口\",description:\"Chrome DevTools Protocol 远程调试端口号。留空以使用默认端口 (9222)。\""
  },

  // ========== 6. 安全预设描述文字 - 卡片区域长描述 ==========
  {
    "old": "Choose a predefined security preset for the agent. This controls terminal auto-execution policy, and file access policy.",
    "new": "为智能体选择预定义的安全预设。这将控制终端自动执行策略和文件访问策略。"
  },

  // ========== 7. 安全预设 - "默认" 的 short/long description (mac + windows 共用) ==========
  {
    "old": "shortDescription:\"Requires manual review for all terminal commands and file accesses outside of the working folders.\",longDescription:\"Useful for typical development with an emphasis on security. It prioritizes safety over speed by requiring manual approval for all terminal commands and files outside the project directory.\"",
    "new": "shortDescription:\"所有终端命令和工作目录外的文件访问都需要手动审核。\",longDescription:\"适用于注重安全性的日常开发。优先考虑安全性而非速度，要求对所有终端命令和项目目录外的文件进行手动审批。\""
  },

  // ========== 8. 安全预设 - "完全访问" 的 short/long description (mac + windows 共用) ==========
  {
    "old": "shortDescription:\"All terminal commands require review. The agent can read or write to any file in the machine.\",longDescription:\"Useful for tasks that require file access across your full machine. The agent has full read and write access to all local files, but all proposed terminal commands require manual review and approval before running.\"",
    "new": "shortDescription:\"所有终端命令都需要审核。智能体可以读写计算机上的任何文件。\",longDescription:\"适用于需要在整台计算机上进行文件访问的任务。智能体拥有所有本地文件的完全读写权限，但所有终端命令在运行前都需要手动审核和批准。\""
  },

  // ========== 9. 安全预设 - "无限制" 的 short/long description (mac + windows 共用) ==========
  {
    "old": "shortDescription:\"Disables all safety barriers for maximal iteration velocity.\",longDescription:\"A high-risk mode that disables all safety barriers. The agent operates with full system access, auto-executes all terminal commands, and reads or writes to all local files without review prompts.\"",
    "new": "shortDescription:\"禁用所有安全限制以获得最大化的迭代速度。\",longDescription:\"一种高风险模式，禁用所有安全限制。智能体以完全系统访问权限运行，自动执行所有终端命令，并在无审核提示的情况下读写所有本地文件。\""
  },

  // ========== 10. 安全预设 displayName - 使用上下文前缀确保精准匹配 ==========
  {
    "old": "displayName:\"Default\",shortDescription:",
    "new": "displayName:\"默认\",shortDescription:"
  },
  {
    "old": "displayName:\"Full machine\",shortDescription:",
    "new": "displayName:\"完全访问\",shortDescription:"
  },
  {
    "old": "displayName:\"Unrestricted\",shortDescription:",
    "new": "displayName:\"无限制\",shortDescription:"
  },

  // ========== 11. 安全预设下拉框 "自定义" 选项的显示文本 ==========
  {
    "old": "\"custom\"?\"Custom\":One[ge]",
    "new": "\"custom\"?\"自定义\":One[ge]"
  },
  {
    "old": "displayName??\"Custom\"",
    "new": "displayName??\"自定义\""
  },

  // ========== 12. Terms of Service 首次使用页面 ==========
  {
    "old": "children:\"Terms of Service & Data Use\"",
    "new": "children:\"服务条款与数据使用\""
  },
  {
    "old": "children:\"AI coding agents are known to have certain security risks, including autonomous code execution, data exfiltration, prompt injection and supply chain risks. Ensure that you monitor and verify all actions taken by the agent.\"",
    "new": "children:\"AI 编程智能体具有一定的安全风险，包括自主代码执行、数据泄露、提示注入和供应链风险。请确保您监控并验证智能体执行的所有操作。\""
  },
  {
    "old": "children:\"Terms and Privacy:\"",
    "new": "children:\"条款与隐私：\""
  },
  {
    "old": "children:\"Terms of Service\"",
    "new": "children:\"服务条款\""
  },
  {
    "old": "children:[\"Privacy Notice\",\" \"]",
    "new": "children:[\"隐私声明\",\" \"]"
  },
  {
    "old": "\"(excluding product analytics data)\"",
    "new": "\"（不含产品分析数据）\""
  },

  // ========== 13. Security Notice 页面 ==========
  {
    "old": "children:\"Security Notice & Data Use\"",
    "new": "children:\"安全须知与数据使用\""
  },
  {
    "old": "children:\"AI coding agents are known to have certain security limitations. Users should be aware of potential risks, including data exfiltration and possible code execution. Avoid processing highly sensitive data and verify all the actions taken by the agent.\"",
    "new": "children:\"AI 编程智能体存在一定的安全局限性。用户应注意潜在风险，包括数据泄露和可能的代码执行。请避免处理高度敏感数据，并验证智能体执行的所有操作。\""
  }
];

// 去重添加
let addedCount = 0;
let updatedCount = 0;
for (const entry of newEntries) {
  const existingIdx = translations.findIndex(t => t.old === entry.old);
  if (existingIdx === -1) {
    translations.push(entry);
    addedCount++;
  } else {
    translations[existingIdx] = entry;
    updatedCount++;
    console.log(`[更新] 已存在的词条被更新: "${entry.old.substring(0, 50)}..."`);
  }
}

console.log(`新增 ${addedCount} 条，更新 ${updatedCount} 条。总计: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('✅ 已成功写入 translations.json (Round 8)');
