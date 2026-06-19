// 分析 DOM 字典与 dom-untranslated.json 之间的差异
import fs from 'fs';

const translationsPath = process.argv[2] || '../translations.json';
const untranslatedPath = process.argv[3] || '../dom-untranslated.json';

// 读取 translations.json
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// 提取 DOM 字典 (从注入脚本中)
let domDict = {};
for (const pair of translations) {
  if (pair.old && pair.old.includes('void win.loadURL(url);') && pair.new && pair.new.includes('dictionary')) {
    // 从注入脚本中提取 dictionary 对象
    const dictMatch = pair.new.match(/const dictionary = (\{[\s\S]*?\});/);
    if (dictMatch) {
      // 手动解析 dictionary (因为是 JS 对象语法，不能直接 JSON.parse)
      const dictStr = dictMatch[1];
      // 提取所有键值对
      const kvRegex = /"([^"]+)":"([^"]+)"/g;
      let match;
      while ((match = kvRegex.exec(dictStr)) !== null) {
        domDict[match[1]] = match[2];
      }
      // 也处理转义的引号
      const kvRegex2 = /\\\\"([^\\]+)\\\\":\\\\"([^\\]+)\\\\"/g;
      while ((match = kvRegex2.exec(dictStr)) !== null) {
        domDict[match[1]] = match[2];
      }
    }
    break;
  }
}

console.log(`\n=== DOM 字典提取结果 ===`);
console.log(`共提取 ${Object.keys(domDict).length} 个键值对\n`);

// 读取 dom-untranslated.json
const untranslated = JSON.parse(fs.readFileSync(untranslatedPath, 'utf8'));

// 分类分析
const pureEnglish = [];  // 纯英文字符串 (需要翻译)
const mixedStrings = []; // 混合字符串 (部分已翻译)
const nonTranslatable = []; // 不需要翻译的 (快捷键、颜色值、标识符等)

for (const item of untranslated.unknown) {
  const str = item.old;
  
  // 检查是否为不可翻译的内容
  if (/^(Ctrl|Alt|Shift)[A-Za-z0-9\-\[\]\/=,]*$/.test(str) || // 快捷键
      /^[0-9a-fA-F]{6}$/.test(str) || // 颜色值
      /^(EEEEEE|cccccc|007acc)$/.test(str) || // 颜色常量
      /^[a-z\-]+$/.test(str) && str.length < 30 && !str.includes(' ') || // 标识符 slug
      /^(ixcgh123@gmail\.com|go\/jetski-chat|chat space)$/.test(str) || // 个人信息/URL
      /^Avatar URL$/.test(str) || // 技术术语字段名
      /^Bot Name$/.test(str) ||
      str === 'Google Chrome' // 品牌名
  ) {
    nonTranslatable.push(str);
    continue;
  }
  
  // 检查是否为纯英文
  if (!/[\u4e00-\u9fa5]/.test(str)) {
    pureEnglish.push({ str, mixed: item.mixed });
  } else {
    mixedStrings.push({ str, mixed: item.mixed });
  }
}

console.log(`=== 分析结果 ===`);
console.log(`未知字符串总数: ${untranslated.unknown.length}`);
console.log(`纯英文 (需要翻译): ${pureEnglish.length}`);
console.log(`混合字符串 (部分已翻译): ${mixedStrings.length}`);
console.log(`不需要翻译 (快捷键/标识符等): ${nonTranslatable.length}`);

// 检查纯英文字符串是否已在 DOM 字典中
console.log(`\n=== 纯英文字符串详细分析 ===\n`);

const needsDictEntry = []; // 需要添加到 DOM 字典的
const alreadyInDict = []; // 已在 DOM 字典中的
const partialMatch = []; // 部分匹配的

for (const item of pureEnglish) {
  const str = item.str;
  
  // 检查完整匹配
  if (domDict[str]) {
    alreadyInDict.push({ en: str, zh: domDict[str] });
    continue;
  }
  
  // 检查是否作为子串被字典中某个键覆盖
  let covered = false;
  for (const key of Object.keys(domDict)) {
    if (str.includes(key) && key.length > 3) {
      partialMatch.push({ en: str, coveredBy: key, zh: domDict[key] });
      covered = true;
      break;
    }
  }
  
  if (!covered) {
    needsDictEntry.push(str);
  }
}

console.log(`已在 DOM 字典中: ${alreadyInDict.length}`);
alreadyInDict.forEach(item => {
  console.log(`  ✅ "${item.en}" → "${item.zh}"`);
});

console.log(`\n部分匹配 (字典中有子串): ${partialMatch.length}`);
partialMatch.forEach(item => {
  console.log(`  ⚠️ "${item.en}"`);
  console.log(`     被 "${item.coveredBy}" 部分覆盖 → "${item.zh}"`);
});

console.log(`\n需要添加到 DOM 字典: ${needsDictEntry.length}`);
needsDictEntry.forEach(str => {
  console.log(`  ❌ "${str}"`);
});

// 分析混合字符串
console.log(`\n=== 混合字符串详细分析 ===\n`);

const mixedNeedFix = []; // 混合字符串中有未翻译英文片段的
const mixedOk = []; // 混合字符串中的英文是合理的 (品牌名等)

for (const item of mixedStrings) {
  const str = item.str;
  
  // 提取混合字符串中的英文片段
  const englishParts = [];
  // 匹配连续的英文单词/短语 (排除已知的品牌名)
  const words = str.match(/[A-Za-z][A-Za-z\s'&\-\.]*[A-Za-z\.]/g) || [];
  for (const w of words) {
    const trimmed = w.trim();
    if (trimmed.length > 2 && 
        !/^(Google|Antigravity|Firebase|Chrome|Android|Dart|Flutter|Gemini|Claude|GPT|MCP|SDK|AI|Web|Ctrl|Alt|Shift|URL|CDP|IDE|API|DevTools|Puppeteer|JavaScript|Pro|Ultra)$/.test(trimmed) &&
        !/^[A-Z]{2,5}$/.test(trimmed) && // 缩写
        !/^(ixcgh123|gmail|com)$/.test(trimmed) // 邮箱部分
    ) {
      // 检查这个英文片段是否在字典中
      if (!domDict[trimmed]) {
        englishParts.push(trimmed);
      }
    }
  }
  
  if (englishParts.length > 0) {
    mixedNeedFix.push({ full: str, untranslatedParts: englishParts });
  } else {
    mixedOk.push(str);
  }
}

console.log(`混合字符串中仍有未翻译英文片段: ${mixedNeedFix.length}`);
mixedNeedFix.forEach(item => {
  console.log(`  ⚠️ 全文: "${item.full.substring(0, 80)}..."`);
  console.log(`     未翻译片段: ${item.untranslatedParts.map(p => `"${p}"`).join(', ')}`);
});

console.log(`\n混合字符串中英文部分已合理处理: ${mixedOk.length}`);

// 输出需要添加到 DOM 字典的精确键值对
console.log(`\n\n========================================`);
console.log(`=== 建议添加到 DOM 字典的精确键值对 ===`);
console.log(`========================================\n`);

// 收集所有需要新翻译的英文字符串
const newEntries = [];

// 1. 纯英文需要翻译的
for (const str of needsDictEntry) {
  newEntries.push({ en: str, context: '纯英文 UI 字符串' });
}

// 2. 混合字符串中的未翻译片段
for (const item of mixedNeedFix) {
  for (const part of item.untranslatedParts) {
    if (!newEntries.find(e => e.en === part)) {
      newEntries.push({ en: part, context: `来自混合: "${item.full.substring(0, 50)}..."` });
    }
  }
}

// 去重并排序
const uniqueEntries = [...new Map(newEntries.map(e => [e.en, e])).values()];
uniqueEntries.sort((a, b) => b.en.length - a.en.length);

console.log(`共需要新增 ${uniqueEntries.length} 个翻译条目:\n`);
uniqueEntries.forEach((entry, i) => {
  console.log(`${i + 1}. "${entry.en}"`);
  console.log(`   来源: ${entry.context}`);
});

// 输出 partial 部分的修复建议
console.log(`\n\n========================================`);
console.log(`=== partial 分类修复建议 ===`);
console.log(`========================================\n`);

for (const item of untranslated.partial) {
  console.log(`原文: "${item.old.substring(0, 80)}..."`);
  console.log(`现译: "${item.new.substring(0, 80)}..."`);
  console.log(`建议: 需要修复拼接问题\n`);
}

// 输出可直接使用的 JSON 格式键值对
console.log(`\n\n========================================`);
console.log(`=== JSON 格式: 可直接粘贴到 DOM 字典 ===`);
console.log(`========================================\n`);

// 为每个条目提供中文翻译建议
const translations_proposed = {};
for (const entry of uniqueEntries) {
  const en = entry.en;
  let zh = '';
  
  // 自动翻译建议
  if (en === 'Configure a chat bot so you can use Jetski directly from Google Chat.') {
    zh = '配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。';
  } else if (en === 'Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.') {
    zh = '配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。';
  } else if (en === 'Configure the browser subagent. It requires') {
    zh = '配置浏览器子智能体。需要安装';
  } else if (en === 'Enter avatar URL (optional)') {
    zh = '输入头像 URL（可选）';
  } else if (en === 'Enter bot name (optional)') {
    zh = '输入机器人名称（可选）';
  } else if (en === 'For help, visit') {
    zh = '如需帮助，请访问';
  } else if (en === 'Google Drive integration not available') {
    zh = 'Google Drive 集成不可用';
  } else if (en === 'Jetski Chat') {
    zh = 'Jetski 聊天';
  } else if (en === 'Marketplace') {
    zh = '市场';
  } else if (en === 'Marketplace Gallery URL') {
    zh = '市场画廊 URL';
  } else if (en === 'Marketplace Item URL') {
    zh = '市场项目 URL';
  } else if (en === 'Selection Actions') {
    zh = '选择操作';
  } else if (en === 'Setup') {
    zh = '设置';
  } else if (en === 'Setup Jetski Chat') {
    zh = '设置 Jetski 聊天';
  } else if (en === 'Typeahead menu') {
    zh = '自动补全菜单';
  } else if (en === 'to be installed.') {
    zh = '已安装。';
  } else if (en === 'or join the') {
    zh = '或加入';
  } else if (en === 'Changes the base URL for marketplace search results. You must restart Antigravity to use the new marketplace after changing this value.') {
    zh = '更改市场搜索结果的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。';
  } else if (en === 'Changes the base URL on each extension page. You must restart Antigravity to use the new marketplace after changing this value.') {
    zh = '更改每个扩展页面的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。';
  } else if (en === 'Configure editor-specific behaviors and shortcuts.') {
    zh = '配置编辑器特定的行为和快捷键。';
  } else if (en === 'Configure tab completion, suggestions, and navigation behavior.') {
    zh = '配置标签页补全、建议和导航行为。';
  } else if (en === 'Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer') {
    zh = '使用 Chrome DevTools 和 Puppeteer 在 Chrome 中进行可靠的自动化、深入调试和性能分析';
  } else if (en === 'Skills providing tailored instructions for happy path Dart and Flutter development workflows.') {
    zh = '提供针对 Dart 和 Flutter 开发工作流量身定制的技能说明。';
  } else if (en === 'We recommend attaching logs. Attaching logs will help the Antigravity team act on and prioritize your feedback.') {
    zh = '我们建议附加日志。附加日志将有助于 Antigravity 团队处理和优先处理您的反馈。';
  } else if (en === 'Describe the bug you encountered...') {
    zh = '描述您遇到的缺陷...';
  } else if (en === 'Plugins are packaged collections of skills and MCPs to help the 智能体 in') {
    zh = '插件是打包的技能和 MCP 集合，帮助 Antigravity 中的智能体与';
  } else if (en === 'work with Google developer products. You can always change your choices in 设置.') {
    zh = 'Google 开发者产品协作。您可以随时在设置中更改选择。';
  } else if (en.includes('Dart and Flutter')) {
    zh = en.replace('Dart and Flutter', 'Dart 和 Flutter');
  } else if (en.includes('Chrome DevTools')) {
    zh = en.replace('Chrome DevTools', 'Chrome DevTools');
  } else if (en.includes('Claude and GPT')) {
    zh = 'Claude 和 GPT 模型';
  } else {
    zh = `[待翻译] ${en}`;
  }
  
  translations_proposed[en] = zh;
}

console.log(JSON.stringify(translations_proposed, null, 2));
