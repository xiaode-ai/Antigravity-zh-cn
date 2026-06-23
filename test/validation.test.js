import assert from 'assert';
import fs from 'fs';
import { syncDomInjectionTranslation } from '../src/dom_injector.js';

console.log('--- Running Validation Unit Tests ---');

// Mock DOM globals for Node environment to prevent execution crashes during evaluation
global.document = {
  body: {},
  documentElement: {
    addEventListener: () => {}
  },
  readyState: 'complete',
  addEventListener: () => {},
  createTreeWalker: () => ({
    nextNode: () => null
  })
};
global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
global.NodeFilter = {
  SHOW_TEXT: 1
};
global.MutationObserver = class {
  observe() {}
  disconnect() {}
};


// Test Case 1: Valid dictionary escaping (exactly 1 backslash: \")
try {
  const translations = [
    {
      old: 'void win.loadURL(url);',
      new: 'win.webContents.on(\'dom-ready\', () => {\n  win.webContents.executeJavaScript("(() => {\\n    const dictionary = {\\"Key\\":\\"Value\\"};\\n    translateTextNode; MutationObserver;\\n  })()");\n});\nvoid win.loadURL(url);'
    }
  ];
  syncDomInjectionTranslation(translations);
  console.log('✅ Test 1 (Valid Escaping) Passed!');
} catch (e) {
  console.error('❌ Test 1 Failed:', e.message);
  process.exit(1);
}

// Test Case 2: Invalid escaping (multiple backslashes: \\\" or more)
try {
  const translations = [
    {
      old: 'void win.loadURL(url);',
      new: 'win.webContents.on(\'dom-ready\', () => {\n  win.webContents.executeJavaScript("(() => {\\n    const dictionary = {\\\\\\"Key\\\\\\\":\\\\\\"Value\\\\\\\"};\\n    translateTextNode; MutationObserver;\\n  })()");\n});\nvoid win.loadURL(url);'
    }
  ];
  syncDomInjectionTranslation(translations);
  console.error('❌ Test 2 Failed: Did not throw error on invalid escaping!');
  process.exit(1);
} catch (e) {
  if (e.message.includes('检测到非法的转义反斜杠数量')) {
    console.log('✅ Test 2 (Invalid Escaping) Passed!');
  } else {
    console.error('❌ Test 2 Failed with unexpected error:', e.message);
    process.exit(1);
  }
}

// Test Case 3: Invalid style modification (should throw style error)
try {
  const translations = [
    {
      old: 'void win.loadURL(url);',
      new: 'win.webContents.on(\'dom-ready\', () => {\n  win.webContents.executeJavaScript("(() => {\\n    const dictionary = {\\"Key\\":\\"Value\\"};\\n    translateTextNode; MutationObserver;\\n    node.parentElement.style.whiteSpace = \'nowrap\';\\n  })()");\n});\nvoid win.loadURL(url);'
    }
  ];
  syncDomInjectionTranslation(translations);
  console.error('❌ Test 3 Failed: Did not throw error on style modification!');
  process.exit(1);
} catch (e) {
  if (e.message.includes('检测到汉化注入脚本中包含修改 DOM 元素样式的逻辑')) {
    console.log('✅ Test 3 (Style Modification Detection) Passed!');
  } else {
    console.error('❌ Test 3 Failed with unexpected error:', e.message);
    process.exit(1);
  }
}

// Test Case 4: Priority translation logic verification
try {
  const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
  const entry = translations.find(t => t.old === 'void win.loadURL(url);');
  assert(entry, 'DOM injection entry not found');

  // Extract the IIFE code inside executeJavaScript
  const match = entry.new.match(/executeJavaScript\("([\s\S]*?)"\)/);
  assert(match, 'executeJavaScript code not found');

  let rawJS = match[1]
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n');

  // Extract IIFE body and append a return statement
  const iifeBodyMatch = rawJS.match(/\(\(\) => \{([\s\S]*)\}\)\(\)/);
  assert(iifeBodyMatch, 'IIFE body not found');
  const iifeBody = iifeBodyMatch[1] + '\nreturn translateText;';

  const translateFn = new Function(iifeBody)();

  // Run test cases on translateFn
  const testCases = [
    { input: 'Back', expected: '返回' },
    { input: '6 days, 23 hours.', expected: '6 天，23 小时。' },
    { input: '4 hours, 53 minutes.', expected: '4 小时，53 分钟。' },
    { input: '1 day, 10 hours.', expected: '1 天，10 小时。' },
    { input: '1 day, 10 hours. If on a supported paid plan, you can use AI credits in the interim or upgrade to a higher tier.', expected: '1 天，10 小时。如果您使用的是受支持的付费方案，在此期间可以使用 AI 点数，或者升级到更高等级。' },
    { input: 'Inherits from global settings.', expected: '继承自全局设置。' },
    { input: 'Inherits from global settings. Local permissions have higher priority. Learn more.', expected: '继承自全局设置。本地权限具有更高优先级。了解更多。' },
    { input: ' active conversations ', expected: '个活跃对话' },
    { input: ' archived conversations.', expected: '个已归档对话.' },
    { input: 'Inherits from', expected: '继承自' },
    { input: 'global settings', expected: '全局设置' },
    { input: 'Learn more', expected: '了解更多' },
    { input: 'Learn more.', expected: '了解更多。' },
    { input: '. Local permissions have higher priority. ', expected: '。本地权限具有更高优先级。' },
    // 新增测试用例
    { input: 'No items found', expected: '未找到任何项' },
    { input: 'Recent', expected: '最近' },
    { input: 'Your quota for this model is running low.', expected: '您对此模型的配额即将用尽。' },
    { input: 'Other Conversations', expected: '其他对话' },
    { input: 'Recent in', expected: '最近在' },
    { input: 'Recent in Antigravity-zh-cn', expected: '最近在 Antigravity-zh-cn' },
    { input: 'Current', expected: '当前' },
    { input: 'Recent Files', expected: '最近文件' },
    { input: 'Pending messages', expected: '待处理消息' },
    { input: 'Pending messages ⓘ', expected: '待处理消息 ⓘ' },
    { input: 'Messages can be sent while theagent is still working. Yourmessage will be queued andinserted at the next availablebreak in reasoning.', expected: '可以在智能体仍在工作时发送消息。您的消息将被排队，并在下一次推理中断时插入。' },
    { input: 'Messages can be sent while the agent is still working. Your message will be queued and inserted at the next available break in reasoning.', expected: '可以在智能体仍在工作时发送消息。您的消息将被排队，并在下一次推理中断时插入。' },
    { input: 'Send all', expected: '发送全部' },
    { input: 'Send all (1)', expected: '发送全部 (1)' },
    { input: 'searching', expected: '正在搜索' },
    { input: 'searching...', expected: '正在搜索...' },
    { input: '1 file, 3 searches', expected: '1 个文件，3 次搜索' },
    { input: '10 files, 1 search', expected: '10 个文件，1 次搜索' },
    { input: 'Agent terminated due to error', expected: '智能体因错误终止' },
    { input: 'You can prompt the model to try again or start a new conversation if the error persists.', expected: '如果错误持续存在，您可以提示模型重试或开始新对话。' },
    { input: 'See our troubleshooting guide for more help.', expected: '请参阅我们的故障排除指南以获取更多帮助。' },
    { input: 'See our', expected: '请参阅我们的' },
    { input: 'troubleshooting guide', expected: '故障排除指南' },
    { input: 'for more help', expected: '以获取更多帮助' },
    { input: 'for more help.', expected: '以获取更多帮助。' },
    { input: 'now', expected: '现在' },
    { input: 'Delete pending message', expected: '删除待处理消息' },
    { input: 'Proceed', expected: '继续' },
    { input: 'This undo action will not make any code changes.', expected: '此撤销操作不会进行任何代码更改。' },
    { input: 'This undo action will not make any code changes', expected: '此撤销操作不会进行任何代码更改' },
    { input: 'Agent execution terminated due to error.', expected: '智能体执行因错误终止。' },
    { input: 'Agent execution terminated due to error', expected: '智能体执行因错误终止' },
    { input: '1 file, 1 folder, 1 search', expected: '1 个文件，1 个文件夹，1 次搜索' },
    { input: '11 files, 3 folders, 5 searches', expected: '11 个文件，3 个文件夹，5 次搜索' },
    { input: '2 files, 1 folder, 6 searches', expected: '2 个文件，1 个文件夹，6 次搜索' },
    { input: '5 files, 3 folders, 5 searches, 10 pages', expected: '5 个文件，3 个文件夹，5 次搜索，10 个页面' },
    { input: '10 pages', expected: '10 个页面' },
    { input: 'New', expected: '新建' },
    { input: 'Model', expected: '模型' },
    { input: 'Stop Execution', expected: '停止执行' },
    { input: 'Version 2.1.4', expected: '版本 2.1.4' },
    { input: '4 files changed', expected: '4 个文件已更改' },
    { input: 'Worked for 3m', expected: '工作了 3m' },
    { input: '1 task running', expected: '1 个任务正在运行' },
    { input: "Your plan's baseline quota wll refresh on 2026/6/21 15:48:43. To continue using this model now,enable AI Credit overages.", expected: '您的方案基准配额将在 2026/6/21 15:48:43 刷新。若要现在继续使用此模型，请启用 AI 超额点数。' },
    { input: "Your plan's baseline quota will refresh on 2026/6/21 15:48:43. To continue using this model now, enable AI Credit overages.", expected: '您的方案基准配额将在 2026/6/21 15:48:43 刷新。若要现在继续使用此模型，请启用 AI 超额点数。' },
    { input: 'Cancel', expected: '取消' },
    { input: 'Delete', expected: '删除' },
    { input: 'Review Changes', expected: '审核更改' },
    { input: 'View Split Diff', expected: '查看分栏对比' },
    { input: 'Collapse All', expected: '折叠全部' },
    { input: 'Comment', expected: '评论' },
    { input: 'Show 19 more', expected: '显示另外 19 项' },
    { input: 'Files', expected: '文\u2060件' },
    { input: 'Walkthrough', expected: '验收文档' },
    { input: 'Task', expected: '任务' },
    { input: 'task', expected: '任务' },
    { input: 'Task log', expected: '任务日志' },
    { input: 'task log', expected: '任务日志' },
    { input: 'log', expected: '日志' },
    { input: 'Log', expected: '日志' },
    { input: 'Implementation Plan', expected: '实现计划' },
    { input: 'Show 19 more...', expected: '显示另外 19 项...' },
    { input: 'Auto-proceeded with', expected: '自动执行' },
    { input: 'Analyzed', expected: '分析了' },
    { input: 'Searched', expected: '搜索了' },
    { input: 'Edited', expected: '编辑了' },
    { input: 'Ran', expected: '运行了' },
    { input: 'Checked', expected: '检查了' },
    { input: 'Killed', expected: '已终止' },
    { input: 'Explored 1 folder', expected: '探索了 1 个文件夹' },
    { input: 'Explored 5 folders', expected: '探索了 5 个文件夹' },
    { input: 'Explored 1 file', expected: '探索了 1 个文件' },
    { input: 'Explored 2 files', expected: '探索了 2 个文件' },
    { input: 'Explored 1 search', expected: '探索了 1 次搜索' },
    { input: 'Explored 3 searches', expected: '探索了 3 次搜索' },
    { input: 'Explored 1 task', expected: '探索了 1 个任务' },
    { input: 'Explored 10 tasks', expected: '探索了 10 个任务' },
    { input: 'Explored 1 artifact', expected: '探索了 1 个产物' },
    { input: 'Explored 10 artifacts', expected: '探索了 10 个产物' },
    { input: 'Comment Ctrl+Alt+M', expected: '评论 Ctrl+Alt+M' },
    { input: 'Working', expected: '正在工作' },
    { input: 'Working...', expected: '正在工作...' },
    { input: 'Editing', expected: '正在编辑' },
    { input: 'Editing...', expected: '正在编辑...' },
    { input: 'See all', expected: '查看全部' },
    { input: 'See all...', expected: '查看全部...' },
    { input: 'View Stacked Diff', expected: '查看堆叠对比' },
    { input: 'Expand All', expected: '展开全部' },
    { input: 'Find', expected: '查找' },
    { input: 'Match case', expected: '区分大小写' },
    { input: 'Match whole word', expected: '全字匹配' },
    { input: 'Use regular expression', expected: '使用正则表达式' },
    { input: 'No results', expected: '无结果' },
    { input: 'Previous match', expected: '上一个匹配项' },
    { input: 'Next match', expected: '下一个匹配项' },
    { input: 'Close (Escape)', expected: '关闭 (Escape)' },
    { input: 'Cancel All Tasks', expected: '取消所有任务' },
    { input: 'Explored', expected: '已探索' },
    { input: 'Exploring', expected: '正在探索' },
    { input: 'Run', expected: '运行' },
    { input: 'file', expected: '文\u2060件' },
    { input: 'result', expected: '结果' },
    { input: 'results', expected: '结果' },
    { input: 'artifact', expected: '产物' },
    { input: 'scratch', expected: '草稿' },
    { input: 'Match case (Aa)', expected: '区分大小写 (Aa)' },
    { input: 'test', expected: '测试' },
    { input: 'more lines', expected: '更多行' },
    { input: 'Match whole word (ab)', expected: '全字匹配 (ab)' },
    { input: 'See all (11)', expected: '查看全部 (11)' },
    { input: 'See all (5)', expected: '查看全部 (5)' },
    { input: 'Show', expected: '显示' },
    { input: 'more', expected: '更多' },
    { input: 'Thought Process', expected: '思考过程' },
    { input: 'Cancel Task', expected: '取消任务' },
    { input: 'Previous match (Shift+Enter)', expected: '上一个匹配项 (Shift+Enter)' },
    { input: 'Next match (Enter)', expected: '下一个匹配项 (Enter)' },
    { input: '+118 more lines', expected: '另外 118 行' },
    { input: '+5 more lines', expected: '另外 5 行' },
    { input: 'Copy Command', expected: '复制命令' },
    { input: 'User cancelled agent execution.', expected: '用户取消了智能体执行。' },
    { input: 'File', expected: '文\u2060件' },
    { input: 'Artifact', expected: '产物' },
    { input: 'Run tests finished', expected: '测试运行完成' },
    { input: 'Thinking for', expected: '正在思考' },
    { input: 'Thinking for...', expected: '正在思考...' },
    { input: 'Thinking for 1.2s', expected: '已思考 1.2s' },
    { input: 'Thinking for 500ms', expected: '已思考 500ms' },
    { input: 'Thought for 1s', expected: '思考了 1s' },
    { input: 'Thought for 500ms', expected: '思考了 500ms' },
    { input: 'Open Diff', expected: '打开对比' },
    { input: 'Copied', expected: '已复制' },
    { input: 'Copy Content', expected: '复制内容' },
    { input: 'View Diff', expected: '查看对比' },
    { input: 'Viewing Diff', expected: '正在查看对比' },
    { input: 'Viewing diff', expected: '正在查看对比' },
    { input: 'Viewing Diff: task.md', expected: '正在查看对比: task.md' },
    { input: 'Viewing diff (2 files)', expected: '正在查看对比 (2 files)' },
    { input: 'view diff', expected: '查看对比' },
    { input: 'View Diff: file.js', expected: '查看对比: file.js' },
    { input: 'File not found', expected: '未找到文件' },
    { input: 'file not found.', expected: '未找到文件' },
    { input: "You need at least 50 AI Credits to send messages. To continue using Gemini 3.5 FIash (Medium) now, purchase more AI Credits. Your plan's baseline quota will refresh on 2026/6/20 19:22:12", expected: "您至少需要 50 个 AI 点数才能发送消息。若要现在继续使用 Gemini 3.5 Flash (中等),请购买更多 AI 点数。您的方案基准配额将在 2026/6/20 19:22:12 刷新。" },
    { input: 'lines', expected: '行' },
    { input: '118 lines', expected: '118 行' },
    { input: '1 file', expected: '1 个文件' },
    { input: '10 files', expected: '10 个文件' },
    { input: '1 artifact', expected: '1 个产物' },
    { input: '5 artifacts', expected: '5 个产物' },
    { input: '10 tasks', expected: '10 个任务' },
    { input: '3 searches', expected: '3 次搜索' },
    { input: '1 result', expected: '1 个结果' },
    { input: '3 results', expected: '3 个结果' },
    { input: '2 folders', expected: '2 个文件夹' },
    { input: 'Working directory', expected: '工作目录' },
    { input: 'Working directory:', expected: '工作目录：' },
    { input: 'Working directory：', expected: '工作目录：' },
    { input: 'Search for files in the project...', expected: '在项目中搜索文件...' },
    { input: 'Search all convos...', expected: '搜索所有对话...' },
    { input: 'Search projects..', expected: '搜索项目...' },
    { input: 'Search projects...', expected: '搜索项目...' },
    { input: 'Command execution finished', expected: '命令执行完成' },
    { input: 'Stop Task', expected: '停止任务' },
    { input: 'Media', expected: '媒体' },
    { input: 'Media (Today 3:24 PM)', expected: '媒体 (今天 3:24 PM)' },
    { input: 'File (Yesterday 10:15 AM)', expected: '文\u2060件 (昨天 10:15 AM)' },
    { input: 'Implementation Plan (2026/06/20 15:32)', expected: '实现计划 (2026/06/20 15:32)' },
    { input: 'Ask a quick question without interrupting the main conversation.', expected: '在不中断主对话的情况下快速提问。' },
    { input: 'Automated Tests', expected: '自动化测试' },
    { input: 'Run until the specified goal is completely finished', expected: '运行直到指定目标完全完成' },
    { input: 'Run an instruction on a recurring schedule or as a one-time timer', expected: '按周期性计划或作为一次性定时器运行指令' },
    { input: 'Invoke a browser agent for web tasks', expected: '调用浏览器智能体执行网页任务' },
    { input: 'Interview me to align on a plan', expected: '通过面谈对齐计划' },
    { input: 'Invoke a team of agents to autonomously tackle large projects', expected: '调用智能体团队自主应对大型项目' },
    { input: 'Reflect on recent successes or corrections to capture reusable skills or rules', expected: '回顾近期成功或修正以捕获可重用的技能或规则' },
    { input: 'Thinking', expected: '正在思考' },
    { input: 'Thinking...', expected: '正在思考...' },
    { input: 'Retrieve and analyze AlphaFold predicted structures', expected: '检索并分析 AlphaFold 预测结构' },
    { input: ' for a protein. Use when the user provides a specific UniProt Accession ID and wants structural confidence metrics (pLDDT), domain boundary analysis, or disorder assessment. Do not use if the user only has a protein name, gene name, or amino acid sequence — ask for a UniProt ID first.', expected: '，用于蛋白质。当用户提供特定的 UniProt 访问 ID 并需要结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用——请先询问 UniProt ID。' },
    { input: 'Orchestrates Android development tasks', expected: '编排 Android 开发任务' },
    { input: ' including project creation, deployment, SDK management, and environment diagnostics using the android command-line tool.', expected: '，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。' },
    { input: 'including project creation, deployment, SDK management, and ...', expected: '，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。' },
    { input: 'for a protein. Use when the ...', expected: '，用于蛋白质。当用户提供特定的 UniProt 访问 ID 并需要结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用——请先询问 UniProt ID。' },
    { input: 'For a protein. Use when the user provides a specific UniProt Accession ID and wants structural confidence metrics (pLDDT), domain boundary analysis, or disorder assessment. Do not use if the user only has a protein name, gene name, or amino acid sequence — ask for a UniProt ID first.', expected: '，用于蛋白质。当用户提供特定的 UniProt 访问 ID 并需要结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用——请先询问 UniProt ID。' },
    { input: ', including project creation, deployment, SDK management, and environment diagnostics...', expected: '，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。' },
    { input: ' including project creation, deployment, SDK management, and ...', expected: '，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。' },
    { input: 'Including project creation, deployment, SDK management, and ...', expected: '，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。' },
    { input: 'Stop Recording Ctrl+M', expected: '停止录制 Ctrl+M' },
    { input: 'Path copied!', expected: '路径已复制！' },
    { input: 'Plugin: science', expected: '插件：科学' },
    { input: 'Plugin: android-cli-plugin', expected: '插件：Android CLI 插件' },
    { input: 'science', expected: '科学' },
    { input: 'android-cli-plugin', expected: 'Android CLI 插件' },
    { input: 'android-cli', expected: 'Android CLI' },
    { input: '编排 Android 开发任务 including project creation, deployment, SDK management, and environment diagnostics using the android command-line tool.', expected: '编排 Android 开发任务，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。' },
    { input: 'Stop Recording', expected: '停止录制' },
    { input: 'Finalizing...', expected: '正在收尾...' },
    { input: 'Finalizing', expected: '正在收尾' },
    { input: 'Plugin: 科学', expected: '插件：科学' },
    { input: '插件: science', expected: '插件：科学' },
    { input: '插件： science', expected: '插件：科学' },
    { input: '插件： android-cli-plugin', expected: '插件：Android CLI 插件' },
    { input: 'Plugin', expected: '插件' },
    { input: 'Plugins', expected: '插件' },
    { input: 'Plugin:', expected: '插件：' },
    { input: 'plugin：', expected: '插件：' },
    { input: 'chrome-devtools-plugin', expected: 'Chrome 开发者工具插件' },
    { input: 'firebase', expected: 'Firebase' },
    { input: 'flutter', expected: 'Flutter' },
    { input: 'google-antigravity-sdk', expected: 'Google Antigravity SDK' },
    { input: 'modern-web-guidance-plugin', expected: '现代 Web 指导插件' },
    { input: 'Commands', expected: '命\u2060令' },
    { input: 'Command', expected: '命\u2060令' },
    { input: 'Convos', expected: '对\u2060话' },
    { input: 'Conversations', expected: '对\u2060话' },
    { input: 'Projects', expected: '项\u2060目' },
    { input: 'Project', expected: '项\u2060目' },
    { input: 'Create project with existingfolder(s).', expected: '使用现有文件夹创建项目。' },
    { input: 'Instantly create a new projectand folder to start building.', expected: '立即创建新项目和文件夹以开始构建。' },
    { input: 'New standalone conversation,outside of projects.', expected: '新建独立对话，不属于任何项目。' },
    { input: 'Create project with existing folder(s).', expected: '使用现有文件夹创建项目。' },
    { input: 'Instantly create a new project and folder to start building.', expected: '立即创建新项目和文件夹以开始构建。' },
    { input: 'New standalone conversation, outside of projects.', expected: '新建独立对话，不属于任何项目。' },
    { input: 'Select branch', expected: '选择分支' },
    { input: 'Select Branch', expected: '选择分支' },
    { input: 'Default Branch', expected: '默认分支' },
    { input: 'Next', expected: '下一步' },
    { input: 'Agent Security Settings', expected: '智能体安全设置' },
    { input: 'Set Project Name', expected: '设置项目名称' },
    { input: 'Project Name', expected: '项目名称' },
    { input: 'Create', expected: '创建' },
    { input: 'Create a new project. You canadd folders to it now or later.', expected: '创建新项目。您现在或稍后可以向其中添加文件夹。' },
    { input: 'Create a new project. You can add folders to it now or later.', expected: '创建新项目。您现在或稍后可以向其中添加文件夹。' },
    { input: 'Confirm Undo', expected: '确认撤销' },
    { input: 'Confirming this undo action will make the following changes:', expected: '确认此撤销操作将带来以下更改：' },
    { input: 'Confirm', expected: '确认' },
    { input: 'Are you sure you want to delete the project Antigravity-zh-cn?', expected: '您确定要删除项目 Antigravity-zh-cn 吗？' },
    { input: 'This will permanently delete Antigravity-zh-cn 和 1 个活跃对话 和 11 个已归档对话 within it. This action cannot be undone.', expected: '这将永久删除其中的 Antigravity-zh-cn 和 1 个活跃对话 和 11 个已归档对话。此操作无法撤销。' },
    { input: 'Cancel step', expected: '取消步骤' }






  ];

  for (const tc of testCases) {
    const actual = translateFn(tc.input, { nodeType: 3 });
    assert.strictEqual(actual.trim(), tc.expected.trim(), `Failed for input: "${tc.input}"\nExpected: "${tc.expected}"\nActual:   "${actual}"`);
  }

  // Verify split DOM node translation for project deletion dialogs
  const splitNode1 = {
    nodeType: 3,
    previousSibling: null,
    textContent: 'Are you sure you want to delete the project '
  };
  const splitNode2 = {
    nodeType: 3,
    previousSibling: splitNode1,
    textContent: 'Antigravity-zh-cn'
  };
  const splitNode3 = {
    nodeType: 3,
    previousSibling: splitNode2,
    textContent: '?'
  };
  splitNode1.nextSibling = splitNode2;
  splitNode2.nextSibling = splitNode3;

  const actualSplit1 = translateFn('Are you sure you want to delete the project ', splitNode1);
  const actualSplit2 = translateFn('Antigravity-zh-cn', splitNode2);
  const actualSplit3 = translateFn('?', splitNode3);

  assert.strictEqual(actualSplit1, '您确定要删除项目 ', 'Should translate split prefix correctly');
  assert.strictEqual(actualSplit2, 'Antigravity-zh-cn', 'Should keep project name as is');
  assert.strictEqual(actualSplit3, ' 吗？', 'Should translate split question mark correctly using sibling check');

  // Verify split DOM node warning translation
  const warnSplitNode1 = {
    nodeType: 3,
    previousSibling: null,
    textContent: 'This will permanently delete '
  };
  const warnSplitNode2 = {
    nodeType: 3,
    previousSibling: warnSplitNode1,
    textContent: 'Antigravity-zh-cn'
  };
  const warnSplitNode3 = {
    nodeType: 3,
    previousSibling: warnSplitNode2,
    textContent: 'within it. This action cannot be undone.'
  };
  warnSplitNode1.nextSibling = warnSplitNode2;
  warnSplitNode2.nextSibling = warnSplitNode3;

  const actualWarn1 = translateFn('This will permanently delete ', warnSplitNode1);
  const actualWarn2 = translateFn('Antigravity-zh-cn', warnSplitNode2);
  const actualWarn3 = translateFn('within it. This action cannot be undone.', warnSplitNode3);

  assert.strictEqual(actualWarn1, '这将永久删除其中的 ', 'Should translate warn split prefix correctly');
  assert.strictEqual(actualWarn2, 'Antigravity-zh-cn', 'Should keep project name as is');
  assert.strictEqual(actualWarn3, '。此操作无法撤销。', 'Should translate warn split suffix correctly');

  // Verify punctuation stack prevention for separate "." node
  const dotNodeWithChinesePrev = {
    nodeType: 3,
    previousSibling: {
      textContent: '了解更多。'
    }
  };
  const actualDot1 = translateFn('.', dotNodeWithChinesePrev);
  assert.strictEqual(actualDot1, '', 'Should omit dot when preceded by Chinese period');

  const dotNodeWithoutChinesePrev = {
    nodeType: 3,
    previousSibling: {
      textContent: '了解更多'
    }
  };
  const actualDot2 = translateFn('.', dotNodeWithoutChinesePrev);
  assert.strictEqual(actualDot2, '。', 'Should translate to Chinese period when NOT preceded by Chinese punctuation');

  // Verify Inherits from global settings variations
  const testSetting1 = translateFn('Inherits from global Settings.', { nodeType: 3 });
  assert.strictEqual(testSetting1.trim(), '继承自全局设置。', 'Should translate Inherits from global Settings. correctly');

  const testSetting2 = translateFn('Inherits From Global Settings', { nodeType: 3 });
  assert.strictEqual(testSetting2.trim(), '继承自全局设置。', 'Should translate Inherits From Global Settings correctly');

  // Verify that elements within chat bubbles/messages are NOT translated
  const chatNodeMock = {
    nodeType: 3,
    parentElement: {
      className: 'chat-message-bubble-content assistant-message',
      tagName: 'DIV',
      getAttribute: (attr) => attr === 'class' ? 'chat-message-bubble-content assistant-message' : null,
      hasAttribute: (attr) => false
    }
  };
  const actualChat = translateFn('Back', chatNodeMock);
  assert.strictEqual(actualChat, 'Back', 'Should bypass translation inside assistant chat messages');

  const chatNodeMock2 = {
    nodeType: 3,
    parentElement: {
      className: 'user-chat-bubble',
      tagName: 'DIV',
      getAttribute: (attr) => attr === 'class' ? 'user-chat-bubble' : null,
      hasAttribute: (attr) => false
    }
  };
  const actualChat2 = translateFn('6 days, 23 hours.', chatNodeMock2);
  assert.strictEqual(actualChat2, '6 days, 23 hours.', 'Should bypass translation inside user chat messages');

  // Verify Monaco Editor / Input box bypass
  const editorMockNode = {
    nodeType: 3,
    parentElement: {
      tagName: 'SPAN',
      getAttribute: (attr) => attr === 'class' ? 'mtk1 monaco-mouse-cursor-text' : null,
      hasAttribute: (attr) => false,
      parentElement: {
        tagName: 'DIV',
        getAttribute: (attr) => attr === 'class' ? 'view-line monaco-editor-line' : null,
        hasAttribute: (attr) => false,
        parentElement: {
          tagName: 'DIV',
          getAttribute: (attr) => attr === 'class' ? 'monaco-editor no-user-select' : null,
          hasAttribute: (attr) => false
        }
      }
    }
  };
  const actualEditorText = translateFn('Back', editorMockNode);
  assert.strictEqual(actualEditorText, 'Back', 'Should bypass translation inside monaco-editor');

  const inputClassMockNode = {
    nodeType: 3,
    parentElement: {
      tagName: 'SPAN',
      getAttribute: (attr) => attr === 'class' ? 'message-input-text-area' : null,
      hasAttribute: (attr) => false
    }
  };
  const actualInputClassText = translateFn('Back', inputClassMockNode);
  assert.strictEqual(actualInputClassText, 'Back', 'Should bypass translation inside wrapper with input class name');

  // Verify find-widget overlay bypass (should translate widget UI text but not editor code text)
  const findWidgetMockNode = {
    nodeType: 3,
    parentElement: {
      tagName: 'DIV',
      childNodes: [],
      getAttribute: (attr) => attr === 'class' ? 'find-widget' : null,
      hasAttribute: () => false,
      parentElement: {
        tagName: 'DIV',
        childNodes: [],
        getAttribute: (attr) => attr === 'class' ? 'monaco-editor' : null,
        hasAttribute: () => false
      }
    }
  };
  const actualFindWidgetText = translateFn('Find', findWidgetMockNode);
  assert.strictEqual(actualFindWidgetText, '查找', 'Should translate "Find" inside find-widget overlay');

  const listMockNode = {
    nodeType: 3,
    parentElement: {
      tagName: 'DIV',
      childNodes: [],
      getAttribute: (attr) => attr === 'class' ? 'monaco-list' : null,
      hasAttribute: () => false,
      parentElement: {
        tagName: 'DIV',
        childNodes: [],
        getAttribute: (attr) => attr === 'class' ? 'monaco-workbench' : null,
        hasAttribute: () => false
      }
    }
  };
  const actualListText = translateFn('Show 19 more...', listMockNode);
  assert.strictEqual(actualListText, '显示另外 19 项...', 'Should translate "Show 19 more..." inside sidebar list pane');

  console.log('✅ Test 4 (Priority Translation Logic & Chat Bypass) Passed!');
} catch (e) {
  console.error('❌ Test 4 Failed:', e);
  process.exit(1);
}

console.log('--- All Unit Tests Passed! ---');
