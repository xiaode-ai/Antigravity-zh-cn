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
      "Copy Command": "复制命令",
      "User cancelled agent execution.": "用户取消了智能体执行。",
      "File": "文件",
      "Artifact": "产物"
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
            '    if (/^\\\\+\\\\s*(\\\\d+)\\\\s+more\\\\s+lines$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/\\\\+\\\\s*(\\\\d+)\\\\s+more\\\\s+lines/gi, \\\'另外 $1 行\\\') + trailingSpaces;\\n' +
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
          console.log('成功重组 translateText 执行层次，并注入新版特赦规则！');
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
