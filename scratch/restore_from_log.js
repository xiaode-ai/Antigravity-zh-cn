import fs from 'fs';
import path from 'path';

const logPath = 'C:\\Users\\i-cgh\\.gemini\\antigravity\\brain\\a5b23472-9c1c-4b4c-8153-9a957ce36999\\.system_generated\\logs\\transcript_full.jsonl';

if (!fs.existsSync(logPath)) {
  console.error('Log file not found at:', logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
console.log('Total log lines:', lines.length);

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    // Find step that contains the file view response for translations.json
    if (obj.content && obj.content.includes('File Path: `file:///c:/Users/i-cgh/Documents/GitHub/Antigravity-zh-cn/translations.json`')) {
      console.log('Found matching log entry in step:', obj.step_index);
      // Extract the content
      const content = obj.content;
      // We want to extract the code from line-numbered format back to raw translations.json content.
      const fileLines = [];
      const linesArray = content.split('\n');
      let insideCode = false;
      for (const l of linesArray) {
        // Matches line format like "100: {...}"
        const match = l.match(/^\d+:\s(.*)$/);
        if (match) {
          fileLines.push(match[1]);
        }
      }
      if (fileLines.length > 0) {
        const restored = fileLines.join('\n');
        fs.writeFileSync('translations.json', restored, 'utf8');
        console.log('成功恢复了 translations.json 的原始备份！');
        process.exit(0);
      }
    }
  } catch (e) {
    // Ignore parse errors on incomplete JSON lines
  }
}

console.log('未在日志中找到 translations.json 的原始查看内容');
