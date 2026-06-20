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
      "View Stacked Diff": "查看堆叠对比",
      "Expand All": "展开全部",
      "Find": "查找",
      "Match case": "区分大小写",
      "Match whole word": "全字匹配",
      "Use regular expression": "使用正则表达式",
      "No results": "无结果",
      "Previous match": "上一个匹配项",
      "Next match": "下一个匹配项",
      "Close (Escape)": "关闭 (Escape)",
      "Cancel All Tasks": "取消所有任务"
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

    // 2. Replace isInsideInputOrEditable function definition
    const startMarkerInput = 'function isInsideInputOrEditable(node) {';
    const endMarkerInput = '  function isKeybinding(text) {';
    const startIdxInput = content.indexOf(startMarkerInput);
    const endIdxInput = content.indexOf(endMarkerInput);

    if (startIdxInput !== -1 && endIdxInput !== -1) {
      const oldInputFunction = content.substring(startIdxInput, endIdxInput);
      const newInputFunction = 
        'function isInsideInputOrEditable(node) {\\n' +
        '    if (!node) return false;\\n' +
        '    let curr = node.nodeType === 3 ? node.parentElement : node;\\n' +
        '    let isWidget = false;\\n' +
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
        '          clsLower.includes(\\\'widget\\\') ||\\n' +
        '          clsLower.includes(\\\'hover\\\') ||\\n' +
        '          clsLower.includes(\\\'find-widget\\\') ||\\n' +
        '          clsLower.includes(\\\'editor-widget\\\') ||\\n' +
        '          clsLower.includes(\\\'monaco-editor-hover\\\') ||\\n' +
        '          clsLower.includes(\\\'list\\\') ||\\n' +
        '          clsLower.includes(\\\'tree\\\') ||\\n' +
        '          clsLower.includes(\\\'pane\\\') ||\\n' +
        '          clsLower.includes(\\\'workbench\\\')\\n' +
        '        ) {\\n' +
        '          isWidget = true;\\n' +
        '        }\\n' +
        '        if (\\n' +
        '          clsLower.includes(\\\'editor\\\') ||\\n' +
        '          clsLower.includes(\\\'input\\\') ||\\n' +
        '          clsLower.includes(\\\'textarea\\\') ||\\n' +
        '          clsLower.includes(\\\'textbox\\\') ||\\n' +
        '          clsLower.includes(\\\'monaco\\\')\\n' +
        '        ) {\\n' +
        '          if (!isWidget) return true;\\n' +
        '        }\\n' +
        '      }\\n' +
        '      curr = curr.parentElement;\\n' +
        '    }\\n' +
        '    return false;\\n' +
        '  }\\n\\n';
      content = content.replace(oldInputFunction, newInputFunction);
      console.log('成功重写 isInsideInputOrEditable 逻辑以支持编辑器微件与侧边栏列表翻译！');
    } else {
      console.error('未在 content 中定位到 isInsideInputOrEditable 边界');
      process.exit(1);
    }

    // 3. Re-structure translateText function dynamically
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
            '    if (/^Working(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在工作...\\\' : \\\'正在工作\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Editing(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在编辑...\\\' : \\\'正在编辑\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^See\\\\s+all(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'查看全部...\\\' : \\\'查看全部\\\') + trailingSpaces;\\n' +
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
