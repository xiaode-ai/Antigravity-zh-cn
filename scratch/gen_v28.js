import fs from 'fs';
import path from 'path';

const v27Path = path.join('scratch', 'merge_translations_v27.js');
const v28Path = path.join('scratch', 'merge_translations_v28.js');

let code = fs.readFileSync(v27Path, 'utf8');

console.log('Finding target in merge_translations_v27.js...');
const linesIdx = code.indexOf("normalized === \\\\\\'lines\\\\\\'");
if (linesIdx !== -1) {
  const lineStart = code.lastIndexOf('\n', linesIdx) + 1;
  const lineEnd = code.indexOf('\n', linesIdx);
  const originalLine = code.substring(lineStart, lineEnd);

  // 在双引号中，所有需要在物理文件里输出为 \\\' 的单引号，都必须使用 \\\\\\' (6个反斜杠) 表达！
  const replacement = "            '    if (/^Pending\\\\\\\\s+messages\\\\\\\\s*(.*)$/i.test(normalized)) {\\\\n' +\n" +
                      "            '      const match = normalized.match(/^Pending\\\\\\\\s+messages\\\\\\\\s*(.*)$/i);\\\\n' +\n" +
                      "            '      return leadingSpaces + \\\\\\'待处理消息\\\\\\' + (match[1] ? \\\\\\' \\\\\\' + match[1] : \\\\\\'\\\\\\') + trailingSpaces;\\\\n' +\n" +
                      "            '    }\\\\n' +\n" +
                      "            '    if (/Messages\\\\\\\\s+can\\\\\\\\s+be\\\\\\\\s+sent\\\\\\\\s+while\\\\\\\\s+the\\\\\\\\s*agent\\\\\\\\s+is\\\\\\\\s+still\\\\\\\\s+working\\\\\\\\.\\\\\\\\s*Your\\\\\\\\s*message\\\\\\\\s+will\\\\\\\\s+be\\\\\\\\s+queued\\\\\\\\s+and\\\\\\\\s*inserted\\\\\\\\s+at\\\\\\\\s+the\\\\\\\\s+next\\\\\\\\s+available\\\\\\\\s*break\\\\\\\\s+in\\\\\\\\s+reasoning\\\\\\\\./i.test(normalized)) {\\\\n' +\n" +
                      "            '      return leadingSpaces + \\\\\\'可以在智能体仍在工作时发送消息。您的消息将被排队，并在下一次推理中断时插入。\\\\\\' + trailingSpaces;\\\\n' +\n" +
                      "            '    }\\\\n' +\n" +
                      "            '    if (/Your\\\\\\\\s+plan\\\\\\\'s\\\\s+baseline\\\\\\\\s+quota\\\\\\\\s+(?:will|wll)\\\\\\\\s+refresh\\\\\\\\s+on\\\\\\\\s+(.+?)\\\\\\\\.\\\\\\\\s*To\\\\\\\\s+continue\\\\\\\\s+using\\\\\\\\s+this\\\\\\\\s+model\\\\\\\\s+now\\\\\\\\s*,\\\\\\\\s*enable\\\\\\\\s+AI\\\\\\\\s+Credit\\\\\\\\s+overages\\\\\\\\./i.test(normalized)) {\\\\n' +\n" +
                      "            '      const match = normalized.match(/Your\\\\\\\\s+plan\\\\\\\'s\\\\s+baseline\\\\\\\\s+quota\\\\\\\\s+(?:will|wll)\\\\\\\\s+refresh\\\\\\\\s+on\\\\\\\\s+(.+?)\\\\\\\\.\\\\\\\\s*To\\\\\\\\s+continue\\\\\\\\s+using\\\\\\\\s+this\\\\\\\\s+model\\\\\\\\s+now\\\\\\\\s*,\\\\\\\\s*enable\\\\\\\\s+AI\\\\\\\\s+Credit\\\\\\\\s+overages\\\\\\\\./i);\\\\n' +\n" +
                      "            '      return leadingSpaces + \\\\\\'您的方案基准配额将在 \\\\\\' + match[1].trim() + \\\\\\' 刷新。若要现在继续使用此模型，请启用 AI 超额点数。\\\\\\' + trailingSpaces;\\\\n' +\n" +
                      "            '    }\\\\n' +\n" +
                      originalLine;

  code = code.substring(0, lineStart) + replacement + code.substring(lineEnd);
  fs.writeFileSync(v28Path, code, 'utf8');
  console.log('Successfully generated merge_translations_v28.js');
} else {
  console.error('Failed to locate target line in merge_translations_v27.js');
  process.exit(1);
}
