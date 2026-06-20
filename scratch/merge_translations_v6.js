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
    const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\')}`)();
    
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
      "A high-risk mode that disables all safety barriers. The agent operates with full system access, auto-executes all terminal commands, and reads or writes to all local files without review prompts.": "一种禁用所有安全屏障的高风险模式。智能体运行拥有完全 of 系统访问权限，自动执行所有终端命令，并且读写所有本地文件而无需审核提示。",
      "Useful for tasks that require file access across your full machine. The agent has full read and write access to all local files, but all proposed terminal commands require manual review and approval before running.": "适用于需要在整机范围内进行文件访问的任务。智能体对所有本地文件拥有完全的读写权限，但所有建议的终端命令在运行前都需要手动审核和批准。",
      "Useful for typical development with an emphasis on security. It prioritizes safety over speed by requiring manual approval for all terminal commands and files outside the project directory.": "适用于注重安全性的典型开发。它通过对所有终端命令以及项目目录之外的文件要求手动审批，将安全性置于速度之上。",
      // New translations requested by user
      "New": "新建",
      "Model": "模型",
      "Stop Execution": "停止执行",
      "Send Queued Message": "发送队列消息",
      "Cancel (Ctrl+D)": "取消 (Ctrl+D)",
      "Mark as Read": "标记为已读",
      "Mark as Unread": "标记为未读",
      "Rename": "重命名",
      "Delete Conversation": "删除对话",
      "Edit Conversation Title": "编辑对话标题",
      "Running": "运行中",
      "Complete": "完成",
      "Archived": "已归档",
      "No conversations matching your search": "没有匹配您搜索的对话",
      "Group By": "分组方式",
      "Project": "项目",
      "Status": "状态",
      "None": "无",
      "Sort Conversations": "对话排序",
      "Last Updated": "最近更新",
      "Alphabetical (A-Z)": "字母顺序 (A-Z)",
      "Date Added": "添加日期",
      "Subtitles": "副标题",
      "Worktree": "工作树",
      "No Subtitle": "无副标题",
      "Scheduled": "已计划",
      "Select Folder(s)": "选择文件夹",
      "Skip": "跳过",
      "Review": "审核",
      "Copy": "复制",
      "Good response": "不错的回应",
      "Bad response": "糟糕的回应",
      "Undo changes up to this point": "撤销更改至此",
      "Archive": "归档",
      "Conversation archived": "对话已归档",
      "Dismiss": "忽略",
      "Undo": "撤销",
      "Overview": "概览",
      "Subagents": "子智能体",
      "No subagents": "无子智能体",
      "Files Changed": "修改的文件",
      "No file changes": "无文件更改",
      "Artifacts": "产物",
      "No artifacts generated": "未生成产物",
      "Background Tasks": "后台任务",
      "No background tasks": "无后台任务",
      "No changes to review": "无待审核更改",
      "Search": "搜索",
      "Copy Path": "复制路径",
      "Export Artifact": "导出产物",
      "Comment (Ctrl+Alt+M)": "评论 (Ctrl+Alt+M)",
      // Latest batch requested
      "Review Changes": "审核更改",
      "View Split Diff": "查看分栏对比",
      "Collapse All": "折叠全部",
      "Comment": "评论",
      "Cancel": "取消",
      "Delete": "删除",
      // Batch 3
      "Files": "文件",
      "Walkthrough": "验收文档",
      "Task": "任务清单",
      "Implementation Plan": "实现计划",
      // Batch 4
      "Auto-proceeded with": "自动执行",
      "Analyzed": "分析了",
      "Searched": "搜索了",
      "Edited": "编辑了",
      "Ran": "运行了",
      "Checked": "检查了",
      "Killed": "已终止",
      // Batch 5
      "Comment Ctrl+Alt+M": "评论 Ctrl+Alt+M"
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
    const startIdxDict = content.indexOf('const dictionary = {');
    const endIdxDict = content.indexOf('};', startIdxDict);
    if (startIdxDict !== -1 && endIdxDict !== -1) {
      const oldDictDeclaration = content.substring(startIdxDict, endIdxDict + 2);
      const newDictDeclaration = `const dictionary = ${newDictStr};`;
      content = content.replace(oldDictDeclaration, newDictDeclaration);
    } else {
      console.error('未在 entry.new 中找到 dictionary 的声明边界');
      process.exit(1);
    }

    // Re-structure translateText function dynamically
    const startMarker = 'function translateText(value, node) {';
    const searchMarker = 'isInsideChatMessage(node)) return value;';
    
    const startIdx = content.indexOf(startMarker);
    if (startIdx !== -1) {
      const endSearchIdx = content.indexOf(searchMarker, startIdx);
      if (endSearchIdx !== -1) {
        const endLineIdx = content.indexOf('\\n', endSearchIdx);
        if (endLineIdx !== -1) {
          const oldHeaderBlock = content.substring(startIdx, endLineIdx + 2);
          
          const replacementHeader = 
            'function translateText(value, node) {\\n' +
            '    if (!value || (!/[A-Za-z]/.test(value) && value.trim() !== \\\'.\\\')) return value;\\n' +
            '    if (node && isInsideInputOrEditable(node)) return value;\\n' +
            '    const trimmed = value.trim();\\n' +
            '    if (!trimmed) return value;\\n' +
            '    const leadingSpaces = (value.match(/^\\\\s*/) || [\\\"\\\"])[0];\\n' +
            '    const trailingSpaces = (value.match(/\\\\s*$/) || [\\\"\\\"])[0];\\n' +
            '    const cleanTrimmed = trimmed.replace(/[\\\\u200b\\\\u200c\\\\u200d\\\\ufeff]/g, \'\');\\n' +
            '    const normalized = cleanTrimmed.replace(/\\\\s+/g, \' \');\\n' +
            // UI force-translate amnesty rules
            '    if (normalized === \\\'Cancel\\\') return leadingSpaces + \\\'取消\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Delete\\\') return leadingSpaces + \\\'删除\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Files\\\') return leadingSpaces + \\\'文件\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Walkthrough\\\') return leadingSpaces + \\\'验收文档\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Task\\\') return leadingSpaces + \\\'任务清单\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Implementation Plan\\\') return leadingSpaces + \\\'实现计划\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Auto-proceeded with\\\') return leadingSpaces + \\\'自动执行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Analyzed\\\') return leadingSpaces + \\\'分析了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Searched\\\') return leadingSpaces + \\\'搜索了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Edited\\\') return leadingSpaces + \\\'编辑了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Ran\\\') return leadingSpaces + \\\'运行了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Checked\\\') return leadingSpaces + \\\'检查了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Killed\\\') return leadingSpaces + \\\'已终止\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Comment Ctrl+Alt+M\\\') return leadingSpaces + \\\'评论 Ctrl+Alt+M\\\' + trailingSpaces;\\n' +
            // High tolerance regex translation rules (without ^ and $ anchors)
            '    if (/Show\\\\s+(\\\\d+)\\\\s+more/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Show\\\\s+(\\\\d+)\\\\s+more/gi, \\\'显示另外 $1 项\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+folders?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+folders?/gi, \\\'探索了 $1 个文件夹\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+files?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+files?/gi, \\\'探索了 $1 个文件\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+search(?:es)?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+search(?:es)?/gi, \\\'探索了 $1 次搜索\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+tasks?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+tasks?/gi, \\\'探索了 $1 个任务\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+artifacts?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+artifacts?/gi, \\\'探索了 $1 个产物\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Thought\\\\s+for\\\\s+(\\\\d+(?:\\\\.\\\\d+)?\\\\w+)/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Thought\\\\s+for\\\\s+(\\\\d+(?:\\\\.\\\\d+)?\\\\w+)/gi, \\\'思考了 $1\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (node && isInsideChatMessage(node)) return value;\\n';
          
          content = content.replace(oldHeaderBlock, replacementHeader);
          console.log('成功重组 translateText 执行层次，并注入高容错性的正则特赦规则！');
        } else {
          console.error('未在 endSearchIdx 后面定位到换行符');
          process.exit(1);
        }
      } else {
        console.error('未在 content 中定位到 searchMarker');
        process.exit(1);
      }
    } else {
      console.error('未在 content 中定位到 startMarker');
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
