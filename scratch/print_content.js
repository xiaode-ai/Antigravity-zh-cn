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
    console.log('oldFn includes "if (dictionary[trimmed])"?', oldFn.includes('if (dictionary[trimmed])'));
    console.log('oldFn includes "return leadingSpaces + dictionary[trimmed] + trailingSpaces;"?', oldFn.includes('return leadingSpaces + dictionary[trimmed] + trailingSpaces;'));
    
    const target = 'if (dictionary[trimmed]) {\n    return leadingSpaces + dictionary[trimmed] + trailingSpaces;\n  }';
    console.log('target1 equals exactly?', oldFn.indexOf(target) !== -1);
    
    // 找出 oldFn 中 "if (dictionary[trimmed])" 之后的 100 个字符的 charCode
    const idx = oldFn.indexOf('if (dictionary[trimmed])');
    if (idx !== -1) {
      const slice = oldFn.substring(idx, idx + 100);
      console.log('字符内容:', JSON.stringify(slice));
      for (let i = 0; i < slice.length; i++) {
        console.log(`  char[${i}]: ${JSON.stringify(slice[i])} (code: ${slice.charCodeAt(i)})`);
      }
    }
  }
}
