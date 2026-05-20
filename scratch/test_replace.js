import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const targetOld = 'children:[p("span",{className:"capitalize",children:e}),p(qe,{name:"keyboard_arrow_down",className:"w-3 h-3 opacity-70 ml-auto"})]})}),p(ns.Content';

console.log('=== 精细化匹配测试 ===');
console.log(`Content contains targetOld: ${content.includes(targetOld)}`);

if (!content.includes(targetOld)) {
  // 逐渐缩小范围，看是在哪里断掉的
  const parts = [
    'children:[p("span",{className:"capitalize",children:e})',
    'p(qe,{name:"keyboard_arrow_down",className:"w-3 h-3 opacity-70 ml-auto"})',
    '])}',
    '})',
    ',p(ns.Content'
  ];
  
  parts.forEach(p => {
    console.log(`Contains "${p}": ${content.includes(p)}`);
  });

  // 我们找出 'children:[p("span",{className:"capitalize",children:e})' 出现的位置并截取后面 200 个字符
  let idx = content.indexOf('children:[p("span",{className:"capitalize",children:e})');
  if (idx !== -1) {
    console.log('\n实际截取上下文 (150 chars):');
    console.log(JSON.stringify(content.substring(idx, idx + 150)));
  }
}
