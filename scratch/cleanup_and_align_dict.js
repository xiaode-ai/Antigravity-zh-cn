import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (entry) {
  const content = entry.new;
  const match = content.match(/const dictionary = (\{.*?\});/);
  if (match) {
    const dictStr = match[1];
    // 解析现有 dictionary
    const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\"/g, '\\')}`)();
    
    // 1. 删除含有中文或混合的混乱键名
    const keysToRemove = [
      "Project-Specific 设置",
      "Delete 项目",
      "Go to 项目",
      "Go To 项目",
      "智能体 设置",
      "智能体 Behavior",
      "管理 application settings.",
      "常规 Feedback",
      "Artifact 审核策略",
      "Local 权限",
      "Security 预设"
    ];
    for (const k of keysToRemove) {
      if (k in dict) {
        delete dict[k];
        console.log(`已删除混乱键: "${k}"`);
      }
    }
    
    // 2. 彻底剔除单数形式翻译以防部分替换
    const singularsToRemove = [
      "Project", "project",
      "Setting", "setting",
      "Conversation", "conversation",
      "Scheduled Task", "scheduled task"
    ];
    for (const k of singularsToRemove) {
      if (k in dict) {
        delete dict[k];
        console.log(`已删除单数键: "${k}"`);
      }
    }
    
    // 3. 补充和对齐复数翻译项
    const pluralsToAdd = {
      "Projects": "项目",
      "projects": "项目",
      "Settings": "设置",
      "settings": "设置",
      "Conversations": "对话",
      "conversations": "对话",
      "Scheduled Tasks": "计划任务",
      "scheduled tasks": "计划任务"
    };
    for (const [k, v] of Object.entries(pluralsToAdd)) {
      dict[k] = v;
      console.log(`已配置/对齐复数键: "${k}" -> "${v}"`);
    }
    
    // 4. 将 dict 按键长度降序排序以确保 MutationObserver 里面的 keys 顺序是正确的
    // （虽然当前没有直接使用 keys，但保留这个好习惯）
    const sortedDict = {};
    Object.keys(dict).sort((a, b) => b.length - a.length).forEach(k => {
      sortedDict[k] = dict[k];
    });

    // 5. 序列化回原来的格式
    // 原来 JSON 中使用转义的双引号：\"key\":\"value\"
    // 我们手动构造这个字符串，以防转义错误
    let newDictStr = '{';
    const entries = Object.entries(sortedDict);
    entries.forEach(([k, v], idx) => {
      // 转义 key 和 value 里的双引号
      const escapedK = k.replace(/"/g, '\\"');
      const escapedV = v.replace(/"/g, '\\"');
      newDictStr += `\\\\\\"${escapedK}\\\\\\\":\\\\\\"${escapedV}\\\\\\\"`;
      if (idx < entries.length - 1) {
        newDictStr += ',';
      }
    });
    newDictStr += '}';
    
    // 替换入 content
    const startIdx = content.indexOf('const dictionary = {');
    const endIdx = content.indexOf('};', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      const oldDictDeclaration = content.substring(startIdx, endIdx + 2);
      const newDictDeclaration = `const dictionary = ${newDictStr};`;
      entry.new = content.replace(oldDictDeclaration, newDictDeclaration);
      
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
      console.log('成功清理并格式化了 translations.json 中的注入字典！');
    } else {
      console.error('未在 entry.new 中找到 dictionary 的声明边界');
    }
  } else {
    console.error('未匹配到 dictionary 对象');
  }
} else {
  console.error('未找到注入项');
}
