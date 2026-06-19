import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (entry) {
  const content = entry.new;
  const match = content.match(/const dictionary = (\{.*?\});/);
  if (match) {
    const dictStr = match[1];
    try {
      const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\"/g, '\\')}`)();
      let out = '';
      for (const [k, v] of Object.entries(dict)) {
        out += `"${k}": "${v}"\n`;
      }
      fs.writeFileSync('scratch/all_dict_keys.txt', out, 'utf8');
      console.log('全部键值对已写入 scratch/all_dict_keys.txt，共:', Object.keys(dict).length);
    } catch (e) {
      console.error('Eval 失败:', e.message);
    }
  } else {
    console.log('未找到 dictionary 定义');
  }
} else {
  console.log('未找到注入条目');
}
