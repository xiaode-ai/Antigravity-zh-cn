import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const results = [];
translations.forEach((item, index) => {
  // 检查 old 或 new 里是否包含关键单词
  const inOld = /project|setting|conversation|scheduled/i.test(item.old);
  const inNew = /project|setting|conversation|scheduled/i.test(item.new);
  
  if (inOld || inNew) {
    // 如果是 100 行的 DOM 字典，我们把它里面匹配到的具体键值对匹配出来
    if (item.old === "void win.loadURL(url);") {
      const matchDict = item.new.match(/const dictionary = (\{.*?\});/);
      if (matchDict) {
        const dict = JSON.parse(matchDict[1].replace(/\\"/g, '"'));
        const matchedKeys = {};
        Object.keys(dict).forEach(k => {
          if (/^(project|setting|conversation|scheduled)$/i.test(k) || k.includes("Project") || k.includes("Setting") || k.includes("Conversation") || k.includes("Scheduled")) {
            matchedKeys[k] = dict[k];
          }
        });
        results.push({ index, old: item.old, matchedDictionaryKeys: matchedKeys });
      }
    } else {
      results.push({ index, old: item.old, new: item.new });
    }
  }
});

console.log(JSON.stringify(results, null, 2));
