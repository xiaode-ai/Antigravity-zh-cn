import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (entry) {
  let content = entry.new;
  
  // 替换 1: 精确匹配处
  const target1 = 'if (dictionary[trimmed]) {\\n    return leadingSpaces + dictionary[trimmed] + trailingSpaces;\\n  }';
  const replacement1 = 'if (dictionary[trimmed]) {\\n    const res = leadingSpaces + dictionary[trimmed] + trailingSpaces;\\n    if (/project|setting|conversation|scheduled/i.test(trimmed)) {\\n      console.log(String.fromCharCode(91,76,49,48,78,95,68,69,66,85,71,93) + String.fromCharCode(32,69,120,97,99,116,32,109,97,116,99,104,33,32,116,114,105,109,109,101,100,61) + trimmed + String.fromCharCode(32,45,62,32) + res);\\n    }\\n    return res;\\n  }';
  
  // 替换 2: 核心匹配处
  const target2 = 'if (dictionary[core]) {\\n      return leadingSpaces + prefix + dictionary[core] + suffix + trailingSpaces;\\n    }';
  const replacement2 = 'if (dictionary[core]) {\\n      const res = leadingSpaces + prefix + dictionary[core] + suffix + trailingSpaces;\\n      if (/project|setting|conversation|scheduled/i.test(core)) {\\n        console.log(String.fromCharCode(91,76,49,48,78,95,68,69,66,85,71,93) + String.fromCharCode(32,67,111,114,101,32,109,97,116,99,104,33,32,99,111,114,101,61) + core + String.fromCharCode(32,45,62,32) + res);\\n      }\\n      return res;\\n    }';
  
  // 替换 3: 未匹配返回处
  const target3 = 'return value;\\n}';
  const replacement3 = 'if (/project|setting|conversation|scheduled/i.test(trimmed)) {\\n    console.log(String.fromCharCode(91,76,49,48,78,95,68,69,66,85,71,93) + String.fromCharCode(32,78,111,32,109,97,116,99,104,33,32,116,114,105,109,109,101,100,61) + trimmed + String.fromCharCode(32,45,62,32) + value);\\n  }\\n  return value;\\n}';

  if (content.includes(target1) && content.includes(target2) && content.includes(target3)) {
    content = content.replace(target1, replacement1);
    content = content.replace(target2, replacement2);
    content = content.replace(target3, replacement3);
    entry.new = content;
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    console.log('成功为 translations.json 进行了安全日志注入！');
  } else {
    console.error('部分或全部替换目标在注入内容中未匹配成功。');
  }
} else {
  console.error('未找到 void win.loadURL(url); 条目');
}
