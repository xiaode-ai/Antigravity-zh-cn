import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (entry) {
  const content = entry.new;
  const startIdx = content.indexOf('function translateText(');
  const endIdx = content.indexOf('const translateTextNode =');

  if (startIdx !== -1 && endIdx !== -1) {
    const oldFn = content.substring(startIdx, endIdx);
    console.log('找到的旧 translateText 定义长度:', oldFn.length);

    // 我们用普通字符串定义 replacement
    const replacementStr = 'function translateText(value) {\\n' +
      '  if (!value || !/[A-Za-z]/.test(value)) return value;\\n' +
      '  const trimmed = value.trim();\\n' +
      '  if (!trimmed) return value;\\n' +
      '  const leadingSpaces = (value.match(/^\\s*/) || [""])[0];\\n' +
      '  const trailingSpaces = (value.match(/\\s*$/) || [""])[0];\\n' +
      '  let res = value;\\n' +
      '  if (dictionary[trimmed]) {\\n' +
      '    res = leadingSpaces + dictionary[trimmed] + trailingSpaces;\\n' +
      '  } else {\\n' +
      '    const match = trimmed.match(/^([.,\\/#!$%\\^&\\*;:{}=\\-_`~()\\"?\\s]*)(.*?)([.,\\/#!$%\\^&\\*;:{}=\\-_`~()\\"?\\s]*)$/);\\n' +
      '    if (match) {\\n' +
      '      const prefix = match[1];\\n' +
      '      const core = match[2];\\n' +
      '      const suffix = match[3];\\n' +
      '      if (dictionary[core]) {\\n' +
      '        res = leadingSpaces + prefix + dictionary[core] + suffix + trailingSpaces;\\n' +
      '      }\\n' +
      '    }\\n' +
      '  }\\n' +
      '  if (/project|setting|conversation|scheduled/i.test(value) || /项目|设置|对话|计划任务/i.test(res)) {\\n' +
      '    console.log("[zh-cn_DEBUG] value=" + JSON.stringify(value) + ", trimmed=" + JSON.stringify(trimmed) + ", res=" + JSON.stringify(res));\\n' +
      '  }\\n' +
      '  return res;\\n' +
      '}\\n    ';

    entry.new = content.substring(0, startIdx) + replacementStr + content.substring(endIdx);
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    console.log('成功为 translations.json 注入了调试日志！');
  } else {
    console.error('未在 translations.json 中定位到 translateText 函数。');
  }
} else {
  console.error('未找到 void win.loadURL(url); 条目');
}
