import fs from 'fs';

// 模拟 DOM 注入里的字典和翻译算法
const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
const match = entry.new.match(/const dictionary = (\{.*?\});/);
const dictStr = match[1];
const dictionary = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\"/g, '\\')}`)();

function translateText(value) {
  if (!value || !/[A-Za-z]/.test(value)) return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  const leadingSpaces = (value.match(/^\s*/) || [""])[0];
  const trailingSpaces = (value.match(/\s*$/) || [""])[0];
  if (dictionary[trimmed]) {
    return leadingSpaces + dictionary[trimmed] + trailingSpaces;
  }
  const match = trimmed.match(/^([.,\/#!$%\^&\*;:{}=\-_`~()\"'?\s]*)(.*?)([.,\/#!$%\^&\*;:{}=\-_`~()\"'?\s]*)$/);
  if (match) {
    const prefix = match[1];
    const core = match[2];
    const suffix = match[3];
    if (dictionary[core]) {
      return leadingSpaces + prefix + dictionary[core] + suffix + trailingSpaces;
    }
  }
  return value;
}

// 测试我们关心的几个复数词
const testCases = [
  "Projects",
  "projects",
  "Settings",
  "settings",
  "Conversations",
  "conversations",
  "Scheduled Tasks",
  "scheduled tasks",
  "Project",
  "Setting"
];

for (const tc of testCases) {
  console.log(`"${tc}" => "${translateText(tc)}"`);
}
