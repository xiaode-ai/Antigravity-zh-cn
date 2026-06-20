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
      "Open Diff": "打开对比",
      "Working directory": "工作目录",
      "Command execution finished": "命令执行完成",
      "Stop Task": "停止任务",
      "Media": "媒体",
      "Ask a quick question without interrupting the main conversation.": "在不中断主对话的情况下快速提问。",
      "Automated Tests": "自动化测试",
      "Run until the specified goal is completely finished": "运行直到指定目标完全完成",
      "Run an instruction on a recurring schedule or as a one-time timer": "按周期性计划或作为一次性定时器运行指令",
      "Invoke a browser agent for web tasks": "调用浏览器智能体执行网页任务",
      "Interview me to align on a plan": "通过面谈对齐计划",
      "Invoke a team of agents to autonomously tackle large projects": "调用智能体团队自主应对大型项目",
      "Reflect on recent successes or corrections to capture reusable skills or rules": "回顾近期成功或修正以捕获可重用的技能或规则"
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
            '    if (normalized === \\\'Cancel All Tasks\\\') return leadingSpaces + \\\'取消所有任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Explored\\\') return leadingSpaces + \\\'已探索\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Exploring\\\') return leadingSpaces + \\\'正在探索\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run\\\') return leadingSpaces + \\\'运行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'file\\\') return leadingSpaces + \\\'文件\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'File\\\') return leadingSpaces + \\\'文件\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'artifact\\\') return leadingSpaces + \\\'产物\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Artifact\\\') return leadingSpaces + \\\'产物\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'scratch\\\') return leadingSpaces + \\\'草稿\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'test\\\') return leadingSpaces + \\\'测试\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'more lines\\\') return leadingSpaces + \\\'更多行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Match case (Aa)\\\') return leadingSpaces + \\\'区分大小写 (Aa)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Match whole word (ab)\\\') return leadingSpaces + \\\'全字匹配 (ab)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Show\\\') return leadingSpaces + \\\'显示\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'more\\\') return leadingSpaces + \\\'更多\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Thought Process\\\') return leadingSpaces + \\\'思考过程\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Cancel Task\\\') return leadingSpaces + \\\'取消任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Copy Command\\\') return leadingSpaces + \\\'复制命令\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Previous match (Shift+Enter)\\\') return leadingSpaces + \\\'上一个匹配项 (Shift+Enter)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Next match (Enter)\\\') return leadingSpaces + \\\'下一个匹配项 (Enter)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'User cancelled agent execution.\\\') return leadingSpaces + \\\'用户取消了智能体执行。\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run tests finished\\\') return leadingSpaces + \\\'测试运行完成\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Open Diff\\\') return leadingSpaces + \\\'打开对比\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Working directory\\\') return leadingSpaces + \\\'工作目录\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Command execution finished\\\') return leadingSpaces + \\\'命令执行完成\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Stop Task\\\') return leadingSpaces + \\\'停止任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Media\\\') return leadingSpaces + \\\'媒体\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Ask a quick question without interrupting the main conversation.\\\') return leadingSpaces + \\\'在不中断主对话的情况下快速提问。\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Automated Tests\\\') return leadingSpaces + \\\'自动化测试\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run until the specified goal is completely finished\\\') return leadingSpaces + \\\'运行直到指定目标完全完成\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run an instruction on a recurring schedule or as a one-time timer\\\') return leadingSpaces + \\\'按周期性计划或作为一次性定时器运行指令\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Invoke a browser agent for web tasks\\\') return leadingSpaces + \\\'调用浏览器智能体执行网页任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Interview me to align on a plan\\\') return leadingSpaces + \\\'通过面谈对齐计划\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Invoke a team of agents to autonomously tackle large projects\\\') return leadingSpaces + \\\'调用智能体团队自主应对大型项目\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Reflect on recent successes or corrections to capture reusable skills or rules\\\') return leadingSpaces + \\\'回顾近期成功或修正以捕获可重用的技能或规则\\\' + trailingSpaces;\\n' +
            '    if (/^Working(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在工作...\\\' : \\\'正在工作\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Editing(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在编辑...\\\' : \\\'正在编辑\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^See\\\\s+all(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'查看全部...\\\' : \\\'查看全部\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^See\\\\s+all\\\\s*\\\\((\\\\d+)\\\\)$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/See\\\\s+all\\\\s*\\\\((\\\\d+)\\\\)/gi, \\\'查看全部 ($1)\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Thinking\\\\s+for(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在思考...\\\' : \\\'正在思考\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Thinking\\\\s+for\\\\s+(.+)$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Thinking\\\\s+for\\\\s+(.+)/gi, \\\'已思考 $1\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\+\\\\s*(\\\\d+)\\\\s+more\\\\s+lines$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/\\\\+\\\\s*(\\\\d+)\\\\s+more\\\\s+lines/gi, \\\'另外 $1 行\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            // Handle quantity-only split text node translations (e.g. "1 file", "1 artifact")
            '    if (/^\\\\d+\\\\s+folders?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+folders?/gi, \\\'$1 个文件夹\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+files?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+files?/gi, \\\'$1 个文件\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+search(?:es)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+search(?:es)?/gi, \\\'$1 次搜索\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+tasks?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+tasks?/gi, \\\'$1 个任务\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+artifacts?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+artifacts?/gi, \\\'$1 个产物\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            // Handle artifact items with date/time stamps
            '    if (/^(Implementation Plan|Task|Walkthrough|Media|File|Artifact|Scratch)\\\\s*\\\\((.+)\\\\)$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^(Implementation Plan|Task|Walkthrough|Media|File|Artifact|Scratch)\\\\s*\\\\((.+)\\\\)$/i);\\n' +
            '      const typeMap = {\\n' +
            '        \\\'implementation plan\\\': \\\'实现计划\\\',\\n' +
            '        \\\'task\\\': \\\'任务清单\\\',\\n' +
            '        \\\'walkthrough\\\': \\\'验收文档\\\',\\n' +
            '        \\\'media\\\': \\\'媒体\\\',\\n' +
            '        \\\'file\\\': \\\'文件\\\',\\n' +
            '        \\\'artifact\\\': \\\'产物\\\',\\n' +
            '        \\\'scratch\\\': \\\'草稿\\\'\\n' +
            '      };\\n' +
            '      const chineseType = typeMap[match[1].toLowerCase()] || match[1];\\n' +
            '      const inner = match[2]\\n' +
            '        .replace(/\\\\bToday\\\\b/gi, \\\'今天\\\')\\n' +
            '        .replace(/\\\\bYesterday\\\\b/gi, \\\'昨天\\\');\\n' +
            '      return leadingSpaces + chineseType + \\\' (\\\' + inner + \\\')\\\' + trailingSpaces;\\n' +
            '    }\\n' +
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
          console.log('成功重组 translateText 执行层次，并注入新版特赦与拆分节点正则规则！');
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
