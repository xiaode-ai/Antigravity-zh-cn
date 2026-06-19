import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');

if (entry) {
  let content = entry.new;
  const match = content.match(/const dictionary = (\{.*?\});/);
  if (match) {
    const dictStr = match[1];
    // Parse the existing dictionary
    const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\"/g, '\\')}`)();
    
    // Define new translations to add
    const newTranslations = {
      "Back": "返回",
      "Available AI Credits": "可用 AI 点数",
      "Plugins are packaged collections of skills and MCPs to help the Agent in Antigravity work with Google developer products. You can always change your choices in Settings.": "插件是经过打包的技能与 MCP 集合，以帮助 Antigravity 中的智能体与 Google 开发者产品协作。您可以随时在设置中更改您的选择。",
      "Configure the browser subagent. It requires Google Chrome to be installed. The browser subagent can be invoked by typing /browser in the conversation input box.": "配置浏览器子智能体。需要安装 Google Chrome。可通过在对话输入框中输入 /browser 来调用浏览器子智能体。",
      "Agent settings and permissions for conversations outside of projects.": "项目之外对话的智能体设置与权限。",
      "Inherits from global settings. Local permissions have higher priority. Learn more.": "继承自全局设置。本地权限具有更高优先级。了解更多。",
      "Add MCP Servers": "添加 MCP 服务器",
      "Search MCP servers by name": "按名称搜索 MCP 服务器",
      "File Reads": "文件读取",
      "Allow/deny agent read access to specific files or directories.": "允许/拒绝智能体对特定文件或目录的读取访问权限。",
      "File Writes": "文件写入",
      "Allow/deny agent write access to specific files or directories.": "允许/拒绝智能体对特定文件或目录的写入访问权限。",
      "Read URLs": "读取 URL",
      "Allow/deny agent read access to specific URLs or domains.": "允许/拒绝智能体对特定 URL 或域的读取访问权限。",
      "Allow/deny specific terminal commands.": "允许/拒绝特定的终端命令。",
      "Allow/deny agent command execution outside the sandbox.": "允许/拒绝智能体在沙盒外执行命令。",
      "External tools the agent can call via Model Context Protocol.": "智能体可通过模型上下文协议 (Model Context Protocol) 调用的外部工具。",
      "Add": "添加",
      "Loading plugins...": "正在加载插件...",
      "A high-risk mode that disables all safety barriers. The agent operates with full system access, auto-executes all terminal commands, and reads or writes to all local files without review prompts.": "一种禁用所有安全屏障的高风险模式。智能体运行拥有完全的系统访问权限，自动执行所有终端命令，并且读写所有本地文件而无需审核提示。",
      "Useful for tasks that require file access across your full machine. The agent has full read and write access to all local files, but all proposed terminal commands require manual review and approval before running.": "适用于需要在整机范围内进行文件访问的任务。智能体对所有本地文件拥有完全的读写权限，但所有建议的终端命令在运行前都需要手动审核和批准。",
      "Useful for typical development with an emphasis on security. It prioritizes safety over speed by requiring manual approval for all terminal commands and files outside the project directory.": "适用于注重安全性的典型开发。它通过对所有终端命令以及项目目录之外的文件要求手动审批，将安全性置于速度之上。"
    };

    // Merge new translations
    for (const [k, v] of Object.entries(newTranslations)) {
      dict[k] = v;
      console.log(`添加/更新字典键: "${k}" -> "${v}"`);
    }

    // Sort dict by key length descending
    const sortedDict = {};
    Object.keys(dict).sort((a, b) => b.length - a.length).forEach(k => {
      sortedDict[k] = dict[k];
    });

    // Serialize back to the required format
    let newDictStr = '{';
    const entries = Object.entries(sortedDict);
    entries.forEach(([k, v], idx) => {
      const escapedK = k.replace(/"/g, '\\"');
      const escapedV = v.replace(/"/g, '\\"');
      newDictStr += `\\"${escapedK}\\":\\"${escapedV}\\"`;
      if (idx < entries.length - 1) {
        newDictStr += ',';
      }
    });
    newDictStr += '}';

    // Replace dictionary definition in content
    const startIdx = content.indexOf('const dictionary = {');
    const endIdx = content.indexOf('};', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      const oldDictDeclaration = content.substring(startIdx, endIdx + 2);
      const newDictDeclaration = `const dictionary = ${newDictStr};`;
      content = content.replace(oldDictDeclaration, newDictDeclaration);
    } else {
      console.error('未在 entry.new 中找到 dictionary 的声明边界');
      process.exit(1);
    }

    // Now update priority translation rules inside translateText function
    const targetMarkers = [
      { t: '// 1. 无敌的优先翻译规则 (绕过所有句子/环境校验，对高频重点词汇实行强力汉化)\\n', e: '    if (node && node.nodeType === 3) {\\n', newline: '\\n' },
      { t: '// 1. 无敌的优先翻译规则 (绕过所有句子/环境校验，对高频重点词汇实行强力汉化)\n', e: '    if (node && node.nodeType === 3) {\n', newline: '\n' },
      { t: '// 1. 无敌的优先翻译规则 (绕过所有句子/环境校验，对高频重点词汇实行强力汉化)\r\n', e: '    if (node && node.nodeType === 3) {\r\n', newline: '\r\n' }
    ];

    let foundMarker = null;
    let markerIndex = -1;
    let endMarkerIndex = -1;

    for (const item of targetMarkers) {
      markerIndex = content.indexOf(item.t);
      endMarkerIndex = content.indexOf(item.e);
      if (markerIndex !== -1 && endMarkerIndex !== -1 && markerIndex < endMarkerIndex) {
        foundMarker = item;
        break;
      }
    }

    if (foundMarker) {
      const startReplaceIdx = markerIndex + foundMarker.t.length;
      const rawInsertion = 
        '    if (normalized === \\\'Back\\\') {\\n' +
        '      return leadingSpaces + \\\'返回\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/^Available\\\\s+AI\\\\s+Credits/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized.replace(/Available\\\\s+AI\\\\s+Credits/i, \\\'可用 AI 点数\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/of\\\\s+the\\\\s+customization\\\\s+budget\\\\s+is\\\\s+available/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized.replace(/of\\\\s+the\\\\s+customization\\\\s+budget\\\\s+is\\\\s+available/i, \\\'的自定义预算可用\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/Plugins\\\\s+are\\\\s+packaged\\\\s+collections\\\\s+of\\\\s+skills\\\\s+and\\\\s+MCPs\\\\s+to\\\\s+help\\\\s+the\\\\s+Agent/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized.replace(/Plugins\\\\s+are\\\\s+packaged\\\\s+collections\\\\s+of\\\\s+skills\\\\s+and\\\\s+MCPs\\\\s+to\\\\s+help\\\\s+the\\\\s+Agent/i, \\\'插件是技能和 MCP 的打包集合，用于帮助智能体\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/work\\\\s+with\\\\s+Google\\\\s+developer\\\\s+products\\\\.\\\\s+You\\\\s+can\\\\s+always\\\\s+change\\\\s+your\\\\s+choices\\\\s+in/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized.replace(/work\\\\s+with\\\\s+Google\\\\s+developer\\\\s+products\\\\.\\\\s+You\\\\s+can\\\\s+always\\\\s+change\\\\s+your\\\\s+choices\\\\s+in/i, \\\'与 Google 开发者产品协作。您可以随时在设置中更改您的选择\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/Configure\\\\s+the\\\\s+browser\\\\s+subagent\\\\.\\\\s+It\\\\s+requires/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized.replace(/Configure\\\\s+the\\\\s+browser\\\\s+subagent\\\\.\\\\s+It\\\\s+requires/i, \\\'配置浏览器子智能体。需要安装\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized.trim() === \\\'to be installed.\\\') {\\n' +
        '      return leadingSpaces + \\\'以运行。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized.match(/\\\\d+\\\\s+(?:day|hour|minute)/i)) {\\n' +
        '      var result = normalized;\\n' +
        '      if (/If\\\\s+on\\\\s+a\\\\s+supported\\\\s+paid\\\\s+plan/i.test(result)) {\\n' +
        '        result = result.replace(/If\\\\s+on\\\\s+a\\\\s+supported\\\\s+paid\\\\s+plan[.,\\\\s]+you\\\\s+can\\\\s+use\\\\s+AI\\\\s+credits\\\\s+in\\\\s+the\\\\s+interim\\\\s+or\\\\s+upgrade\\\\s+to\\\\s+a\\\\s+higher\\\\s+tier\\\\.?/i, \\\'如果您使用的是受支持的付费方案，在此期间可以使用 AI 点数，或者升级到更高等级。\\\');\\n' +
        '      }\\n' +
        '      if (/You\\\\s+have\\\\s+used\\\\s+some\\\\s+of\\\\s+your\\\\s+weekly\\\\s+limit/i.test(result)) {\\n' +
        '        result = result.replace(/You\\\\s+have\\\\s+used\\\\s+some\\\\s+of\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+it\\\\s+will\\\\s+fully\\\\s+refresh\\\\s+in/i, \\\'您已使用了部分每周限额，将在以下时间后完全刷新：\\\');\\n' +
        '      }\\n' +
        '      if (/You\\\\s+have\\\\s+used\\\\s+some\\\\s+of\\\\s+your\\\\s+5-hour\\\\s+limit/i.test(result)) {\\n' +
        '        result = result.replace(/You\\\\s+have\\\\s+used\\\\s+some\\\\s+of\\\\s+your\\\\s+5-hour\\\\s+limit,\\\\s+it\\\\s+will\\\\s+fully\\\\s+refresh\\\\s+in/i, \\\'您已使用了部分五小时限额，将在以下时间后完全刷新：\\\');\\n' +
        '      }\\n' +
        '      if (/You\\\\s+have\\\\s+hit\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+the\\\\s+5-hour\\\\s+limit\\\\s+does\\\\s+not\\\\s+currently\\\\s+apply/i.test(result)) {\\n' +
        '        result = result.replace(/You\\\\s+have\\\\s+hit\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+the\\\\s+5-hour\\\\s+limit\\\\s+does\\\\s+not\\\\s+currently\\\\s+apply\\\\.\\\\s+Your\\\\s+weekly\\\\s+limit\\\\s+will\\\\s+fully\\\\s+refresh\\\\s+in/i, \\\'您已达到每周限额，目前不适用五小时限制。您的每周限额将在此时间后完全刷新：\\\');\\n' +
        '      }\\n' +
        '      if (/You\\\\s+have\\\\s+hit\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+it\\\\s+refreshes\\\\s+in/i.test(result)) {\\n' +
        '        result = result.replace(/You\\\\s+have\\\\s+hit\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+it\\\\s+refreshes\\\\s+in/i, \\\'您已达到每周限额，将在 \\\');\\n' +
        '      }\\n' +
        '      result = result\\n' +
        '        .replace(/(\\\\d+)\\\\s+days?([,\\\\s\\\\.]*)/gi, function(match, num, punc) {\\n' +
        '          var cnPunc = \\\'\\\';\\n' +
        '          if (punc.indexOf(\\\'.\\\') !== -1) cnPunc = \\\'。\\\';\\n' +
        '          else if (punc.indexOf(\\\',\\\') !== -1) cnPunc = \\\'，\\\';\\n' +
        '          else if (punc.trim() === \\\'\\\') cnPunc = \\\' \\\';\\n' +
        '          return num + \\\' 天\\\' + cnPunc;\\n' +
        '        })\\n' +
        '        .replace(/(\\\\d+)\\\\s+hours?([,\\\\s\\\\.]*)/gi, function(match, num, punc) {\\n' +
        '          var cnPunc = \\\'\\\';\\n' +
        '          if (punc.indexOf(\\\'.\\\') !== -1) cnPunc = \\\'。\\\';\\n' +
        '          else if (punc.indexOf(\\\',\\\') !== -1) cnPunc = \\\'，\\\';\\n' +
        '          else if (punc.trim() === \\\'\\\') cnPunc = \\\' \\\';\\n' +
        '          return num + \\\' 小时\\\' + cnPunc;\\n' +
        '        })\\n' +
        '        .replace(/(\\\\d+)\\\\s+minutes?([,\\\\s\\\\.]*)/gi, function(match, num, punc) {\\n' +
        '          var cnPunc = \\\'\\\';\\n' +
        '          if (punc.indexOf(\\\'.\\\') !== -1) cnPunc = \\\'。\\\';\\n' +
        '          else if (punc.indexOf(\\\',\\\') !== -1) cnPunc = \\\'，\\\';\\n' +
        '          else if (punc.trim() === \\\'\\\') cnPunc = \\\' \\\';\\n' +
        '          return num + \\\' 分钟\\\' + cnPunc;\\n' +
        '        });\\n' +
        '      result = result.replace(/，\\\\s*。/g, \\\'。\\\').replace(/。\\\\s*，/g, \\\'。\\\').replace(/\\\\s+/g, \\\' \\\').trim();\\n' +
        '      return leadingSpaces + result + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/Inherits\\\\s+from\\\\s+global\\\\s+settings/i.test(normalized)) {\\n' +
        '      var cleanWord = normalized.replace(/[.\\\\s]/g, \\\'\\\').toLowerCase();\\n' +
        '      if (cleanWord === \\\'inheritsfromglobalsettings\\\') {\\n' +
        '        return leadingSpaces + \\\'继承自全局设置。\\\' + trailingSpaces;\\n' +
        '      }\\n' +
        '      return leadingSpaces + normalized' +
        '        .replace(/Inherits\\\\s+from\\\\s+global\\\\s+settings\\\\.?\\\\s*Local\\\\s+permissions\\\\s+have\\\\s+higher\\\\s+priority\\\\.?\\\\s*Learn\\\\s+more\\\\.?/i, \\\'继承自全局设置。本地权限具有更高优先级。了解更多。\\\')' +
        '        .replace(/Inherits\\\\s+from\\\\s+global\\\\s+settings\\\\.?\\\\s*Local\\\\s+permissions\\\\s+have\\\\s+higher\\\\s+priority\\\\.?/i, \\\'继承自全局设置。本地权限具有更高优先级。\\\')' +
        '        .replace(/Inherits\\\\s+from\\\\s+global\\\\s+settings\\\\.?/i, \\\'继承自全局设置。\\\')' +
        '        .replace(/Learn\\\\s+more\\\\.?/i, \\\'了解更多。\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/Local\\\\s+permissions\\\\s+have\\\\s+higher\\\\s+priority/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized' +
        '        .replace(/Local\\\\s+permissions\\\\s+have\\\\s+higher\\\\s+priority\\\\.?\\\\s*Learn\\\\s+more\\\\.?/i, \\\'本地权限具有更高优先级。了解更多。\\\')' +
        '        .replace(/Local\\\\s+permissions\\\\s+have\\\\s+higher\\\\s+priority\\\\.?/i, \\\'本地权限具有更高优先级。\\\')' +
        '        .replace(/Learn\\\\s+more\\\\.?/i, \\\'了解更多。\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/Agent\\\\s+settings\\\\s+and\\\\s+permissions\\\\s+for\\\\s+conversations\\\\s+outside\\\\s+of\\\\s+projects/i.test(normalized)) {\\n' +
        '      return leadingSpaces + normalized.replace(/Agent\\\\s+settings\\\\s+and\\\\s+permissions\\\\s+for\\\\s+conversations\\\\s+outside\\\\s+of\\\\s+projects\\\\./i, \\\'项目外对话的智能体设置和权限。\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    var budgetMatch = normalized.match(/^(\\\\d+\\\\.?\\\\d*)% of the customization budget is available/);\\n' +
        '    if (budgetMatch) {\\n' +
        '      return leadingSpaces + budgetMatch[1] + \\\'% 的自定义预算可用。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    var bdMatch = normalized.match(/^Show (\\\\d+) (breakdowns?)/);\\n' +
        '    if (bdMatch) {\\n' +
        '      return leadingSpaces + \\\'显示 \\\' + bdMatch[1] + \\\' 个明细\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    var convMatch = normalized.match(/^(\\\\d+) (active conversations?) and (\\\\d+) (archived conversations?)/);\\n' +
        '    if (convMatch) {\\n' +
        '      return leadingSpaces + convMatch[1] + \\\' 个活跃对话和 \\\' + convMatch[3] + \\\' 个已归档对话。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    var deleteProjMatch = normalized.match(/^Permanently\\\\s+delete\\\\s+(.+?)\\\\\\s+(?:including|包括)?\\\\\\s*(\\\\d+)\\\\\\s+active\\\\s+conversations?\\\\\\\\s+and\\\\\\\\s+(\\\\d+)\\\\\\\\s+archived\\\\\\\\s+conversations?/i);\\n' +
        '    if (deleteProjMatch) {\\n' +
        '      return leadingSpaces + \\\'永久删除 \\\' + deleteProjMatch[1] + \\\', 包括 \\\' + deleteProjMatch[2] + \\\' 个活跃对话和 \\\' + deleteProjMatch[3] + \\\' 个已归档对话。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Permanently delete\\\') {\\n' +
        '      return leadingSpaces + \\\'永久删除 \\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    var deleteSuffixMatch = normalized.match(/(?:(including|包括)\\\\\\\\s+)?(\\\\\\\\d+)\\\\\\\\s+active\\\\\\\\s+conversations?\\\\\\\\s+and\\\\\\\\s+(\\\\\\\\d+)\\\\\\\\s+archived\\\\\\\\s+conversations?/i);\\n' +
        '    if (deleteSuffixMatch) {\\n' +
        '      var hasIncl = deleteSuffixMatch[1];\\n' +
        '      if (hasIncl) {\\n' +
        '        return leadingSpaces + \\\'包括 \\\' + deleteSuffixMatch[2] + \\\' 个活跃对话和 \\\' + deleteSuffixMatch[3] + \\\' 个已归档对话\\\' + trailingSpaces;\\n' +
        '      } else {\\n' +
        '        return leadingSpaces + deleteSuffixMatch[2] + \\\' 个活跃对话和 \\\' + deleteSuffixMatch[3] + \\\' 个已归档对话\\\' + trailingSpaces;\\n' +
        '      }\\n' +
        '    }\\n' +
        '    if (normalized.includes(\\\'active conversation\\\')) {\\n' +
        '      return leadingSpaces + normalized.replace(/active\\\\s+conversations?/i, \\\'个活跃对话\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized.includes(\\\'archived conversation\\\')) {\\n' +
        '      return leadingSpaces + normalized.replace(/archived\\\\s+conversations?/i, \\\'个已归档对话\\\') + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'and\\\') {\\n' +
        '      return leadingSpaces + \\\'和\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Add MCP Servers\\\') {\\n' +
        '      return leadingSpaces + \\\'添加 MCP 服务器\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Search MCP servers by name\\\') {\\n' +
        '      return leadingSpaces + \\\'按名称搜索 MCP 服务器\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'File Reads\\\') {\\n' +
        '      return leadingSpaces + \\\'文件读取\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'File Writes\\\') {\\n' +
        '      return leadingSpaces + \\\'文件写入\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Read URLs\\\') {\\n' +
        '      return leadingSpaces + \\\'读取 URL\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Allow/deny agent read access to specific files or directories.\\\') {\\n' +
        '      return leadingSpaces + \\\'允许/拒绝智能体对特定文件或目录的读取访问权限。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Allow/deny agent write access to specific files or directories.\\\') {\\n' +
        '      return leadingSpaces + \\\'允许/拒绝智能体对特定文件或目录的写入访问权限。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Allow/deny agent read access to specific URLs or domains.\\\') {\\n' +
        '      return leadingSpaces + \\\'允许/拒绝智能体对特定 URL 或域的读取访问权限。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Allow/deny specific terminal commands.\\\') {\\n' +
        '      return leadingSpaces + \\\'允许/拒绝特定的终端命令。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Allow/deny agent command execution outside the sandbox.\\\') {\\n' +
        '      return leadingSpaces + \\\'允许/拒绝智能体在沙盒外执行命令。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'External tools the agent can call via Model Context Protocol.\\\') {\\n' +
        '      return leadingSpaces + \\\'智能体可通过模型上下文协议 (Model Context Protocol) 调用的外部工具。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Add\\\') {\\n' +
        '      return leadingSpaces + \\\'添加\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Loading plugins...\\\') {\\n' +
        '      return leadingSpaces + \\\'正在加载插件...\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'allow\\\') {\\n' +
        '      return leadingSpaces + \\\'允许\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'ask\\\') {\\n' +
        '      return leadingSpaces + \\\'询问\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'deny\\\') {\\n' +
        '      return leadingSpaces + \\\'拒绝\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Execute URLs\\\') {\\n' +
        '      return leadingSpaces + \\\'执行 URL\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Allow/deny agent browser actuation access to specific URLs.\\\') {\\n' +
        '      return leadingSpaces + \\\'允许/拒绝智能体浏览器对特定 URL 的执行访问权限。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    var sendFeedbackMatch = normalized.match(/^Send\\s+feedback\\s+as\\s+(.+)/i);\\n' +
        '    if (sendFeedbackMatch) {\\n' +
        '      return leadingSpaces + \\\'以 \\\' + sendFeedbackMatch[1] + \\\' 身份发送反馈\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Send feedback as\\\') {\\n' +
        '      return leadingSpaces + \\\'以以下身份发送反馈：\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Attaching logs requires an email address\\\') {\\n' +
        '      return leadingSpaces + \\\'附加日志需要提供电子邮箱地址\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized === \\\'Copy path\\\') {\\n' +
        '      return leadingSpaces + \\\'复制路径\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/You\\\\s+have\\\\s+hit\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+it\\\\s+refreshes\\\\s+in/i.test(normalized)) {\\n' +
        '      return leadingSpaces + \\\'您已达到每周限额，将在 \\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized.trim() === \\\'If on a supported paid plan, you can use AI credits in the interim or upgrade to a higher tier.\\\') {\\n' +
        '      return leadingSpaces + \\\'如果您使用的是受支持的付费方案，在此期间可以使用 AI 点数，或者升级到更高等级。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (/You\\\\s+have\\\\s+hit\\\\s+your\\\\s+weekly\\\\s+limit,\\\\s+the\\\\s+5-hour\\\\s+limit\\\\s+does\\\\s+not\\\\s+currently\\\\s+apply/i.test(normalized)) {\\n' +
        '      return leadingSpaces + \\\'您已达到每周限额，目前不适用五小时限制。您的每周限额将在此时间后完全刷新：\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    // 安全预设 1: 高风险模式\\n' +
        '    if (normalized.includes(\\\'high-risk mode\\\') || normalized.includes(\\\'disables all safety barriers\\\')) {\\n' +
        '      return leadingSpaces + \\\'一种禁用所有安全屏障的高风险模式。智能体运行拥有完全的系统访问权限，自动执行所有终端命令，并且读写所有本地文件而无需审核提示。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized.includes(\\\'operates with full system access\\\') || normalized.includes(\\\'without review prompts\\\') || normalized.includes(\\\'auto-executes all terminal commands\\\')) {\\n' +
        '      return \\\'\\\';\\n' +
        '    }\\n' +
        '    // 安全预设 2: 完全访问模式\\n' +
        '    if (normalized.includes(\\\'require file access\\\') || normalized.includes(\\\'across your full machine\\\') || normalized.includes(\\\'across yourfull machine\\\')) {\\n' +
        '      return leadingSpaces + \\\'适用于需要在整机范围内进行文件访问的任务。智能体对所有本地文件拥有完全 of 读写权限，但所有建议的终端命令在运行前都需要手动审核和批准。\\\' + trailingSpaces;\\n' + // 等等，这里我看到我又写成了"完全 of 读写权限"，还是改成"完全的读写权限"比较地道。我们把它改成“完全的读写权限”
        '    }\\n' +
        '    if (normalized.includes(\\\'full read and write\\\') || normalized.includes(\\\'writeaccess\\\') || normalized.includes(\\\'approvalbefore\\\') || normalized.includes(\\\'manual review and approval\\\')) {\\n' +
        '      return \\\'\\\';\\n' +
        '    }\\n' +
        '    // 安全预设 3: 典型安全模式\\n' +
        '    if (normalized.includes(\\\'typical development\\\') || normalized.includes(\\\'emphasis on security\\\') || normalized.includes(\\\'emphasis onsecurity\\\')) {\\n' +
        '      return leadingSpaces + \\\'适用于注重安全性的典型开发。它通过对所有终端命令以及项目目录之外的文件要求手动审批，将安全性置于速度之上。\\\' + trailingSpaces;\\n' +
        '    }\\n' +
        '    if (normalized.includes(\\\'prioritizes safety over speed\\\') || normalized.includes(\\\'outside the project directory\\\') || normalized.includes(\\\'requiringmanual\\\') || normalized.includes(\\\'andfiles\\\')) {\\n' +
        '      return \\\'\\\';\\n' +
        '    }\\n';

      // 修复上面的“完全 of 读写权限” -> “完全的读写权限”
      const correctedRawInsertion = rawInsertion.replace('完全 of 读写权限', '完全的读写权限');
      const insertion = correctedRawInsertion.replace(/\\n/g, foundMarker.newline);
      content = content.substring(0, startReplaceIdx) + insertion + content.substring(endMarkerIndex);
      console.log('成功利用区域替换覆盖了旧的优先汉化规则代码块！使用的新行表示形式为:', JSON.stringify(foundMarker.newline));
    } else {
      console.error('未在 entry.new 中找到能够匹配的优先翻译规则起始与结束标记，无法替换。');
      process.exit(1);
    }

    if (!content.includes('function isInsideChatMessage')) {
      const target = 'function isInsideInputOrEditable';
      const replacement = 'function isInsideChatMessage(node) {\\n    if (!node) return false;\\n    let curr = node.nodeType === 3 ? node.parentElement : node;\\n    while (curr) {\\n      const cls = curr.getAttribute ? (curr.getAttribute(\\\'class\\\') || \\\'\\\') : \\\'\\\';\\n      if (cls && typeof cls === \\\'string\\\') {\\n        const clsLower = cls.toLowerCase();\\n        if (\\n          clsLower.includes(\\\'message\\\') || \\n          clsLower.includes(\\\'bubble\\\') || \\n          clsLower.includes(\\\'markdown\\\')\\n        ) {\\n          return true;\\n        }\\n      }\\n      const tagName = curr.tagName ? curr.tagName.toUpperCase() : \\\'\\\';\\n      if (tagName === \\\'PRE\\\' || tagName === \\\'CODE\\\') {\\n        return true;\\n      }\\n      if (curr.hasAttribute && curr.hasAttribute(\\\'data-message-id\\\')) {\\n        return true;\\n      }\\n      if (curr.getAttribute) {\\n        const testId = curr.getAttribute(\\\'data-testid\\\') || \\\'\\\';\\n        if (testId.toLowerCase().includes(\\\'message\\\')) {\\n          return true;\\n        }\\n      }\\n      curr = curr.parentElement;\\n    }\\n    return false;\\n  }\\n\\n  function isInsideInputOrEditable';
      content = content.replace(target, replacement);
      console.log('已成功注入 isInsideChatMessage 函数定义。');
    }

    if (!content.includes('if (node && isInsideChatMessage(node))')) {
      const target = 'if (node && isInsideInputOrEditable(node)) return value;';
      const replacement = 'if (node && isInsideChatMessage(node)) return value;\\n    if (node && isInsideInputOrEditable(node)) return value;';
      content = content.replace(target, replacement);
      console.log('已在 translateText 函数中加入 isInsideChatMessage 校验调用。');
    }

    // 增加覆写/升级 isInsideInputOrEditable 的逻辑
    const startIdxInput = content.indexOf('function isInsideInputOrEditable');
    const endIdxInput = content.indexOf('function isKeybinding');
    if (startIdxInput !== -1 && endIdxInput !== -1 && startIdxInput < endIdxInput) {
      const oldInputFn = content.substring(startIdxInput, endIdxInput);
      const newInputFn = 
        'function isInsideInputOrEditable(node) {\\n' +
        '    if (!node) return false;\\n' +
        '    let curr = node.nodeType === 3 ? node.parentElement : node;\\n' +
        '    while (curr) {\\n' +
        '      const tagName = curr.tagName ? curr.tagName.toUpperCase() : \\\'\\\';\\n' +
        '      if (tagName === \\\'INPUT\\\') {\\n' +
        '        const type = (curr.getAttribute(\\\'type\\\') || \\\'text\\\').toLowerCase();\\n' +
        '        if (![\\\'button\\\', \\\'submit\\\', \\\'reset\\\', \\\'checkbox\\\', \\\'radio\\\'].includes(type)) return true;\\n' +
        '      }\\n' +
        '      if (tagName === \\\'TEXTAREA\\\') return true;\\n' +
        '      if (curr.hasAttribute && curr.hasAttribute(\\\'contenteditable\\\')) return true;\\n' +
        '      \\n' +
        '      const cls = curr.getAttribute ? (curr.getAttribute(\\\'class\\\') || \\\'\\\') : \\\'\\\';\\n' +
        '      if (cls && typeof cls === \\\'string\\\') {\\n' +
        '        const clsLower = cls.toLowerCase();\\n' +
        '        if (\\n' +
        '          clsLower.includes(\\\'editor\\\') ||\\n' +
        '          clsLower.includes(\\\'input\\\') ||\\n' +
        '          clsLower.includes(\\\'textarea\\\') ||\\n' +
        '          clsLower.includes(\\\'textbox\\\') ||\\n' +
        '          clsLower.includes(\\\'monaco\\\')\\n' +
        '        ) {\\n' +
        '          return true;\\n' +
        '        }\\n' +
        '      }\\n' +
        '      curr = curr.parentElement;\\n' +
        '    }\\n' +
        '    return false;\\n' +
        '  }\\n\\n  ';
      content = content.replace(oldInputFn, newInputFn);
      console.log('已成功重写/升级 isInsideInputOrEditable 拦截逻辑！');
    } else {
      console.error('未能在 content 中定位 isInsideInputOrEditable 替换边界');
      process.exit(1);
    }

    entry.new = content;
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    console.log('成功将所有更新写回 translations.json！');
  } else {
    console.error('未匹配到 dictionary 对象');
  }
} else {
  console.error('未找到注入项');
}
