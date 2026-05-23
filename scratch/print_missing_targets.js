import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

const mainContent = fs.readFileSync(mainBakPath, 'utf8');
const wbContent = fs.readFileSync(wbBakPath, 'utf8');

const targets = [
  { name: 'Recording...', term: 'Recording...' },
  { name: 'Terminal background processes', term: 'background processes' },
  { name: 'Terminal', term: 'Terminal' },
  { name: 'Browser', term: 'Browser' }
];

function cleanContext(ctx) {
  return ctx.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
}

targets.forEach(target => {
  console.log(`\n=================== Target: ${target.name} ("${target.term}") ===================`);
  
  // Search main.js.bak
  let idx = -1;
  let count = 0;
  while ((idx = mainContent.indexOf(target.term, idx + 1)) !== -1) {
    const start = Math.max(0, idx - 120);
    const end = Math.min(mainContent.length, idx + target.term.length + 120);
    const context = cleanContext(mainContent.substring(start, end));
    
    const matchStr = mainContent.substring(idx - 5, idx + target.term.length + 5);
    const isQuoted = matchStr.includes(`"${target.term}"`) || matchStr.includes(`'${target.term}'`) || matchStr.includes(`\`${target.term}\``) || target.term.length > 10;
    
    if (isQuoted || target.term === 'background processes') {
      count++;
      console.log(`[main.js] Match #${count} at position ${idx}:`);
      console.log(`  ${context}`);
      if (count >= 10) break;
    }
  }

  // Search workbench.desktop.main.js.bak
  idx = -1;
  count = 0;
  while ((idx = wbContent.indexOf(target.term, idx + 1)) !== -1) {
    const start = Math.max(0, idx - 120);
    const end = Math.min(wbContent.length, idx + target.term.length + 120);
    const context = cleanContext(wbContent.substring(start, end));
    
    const matchStr = wbContent.substring(idx - 5, idx + target.term.length + 5);
    const isQuoted = matchStr.includes(`"${target.term}"`) || matchStr.includes(`'${target.term}'`) || matchStr.includes(`\`${target.term}\``) || target.term.length > 10;
    
    if (isQuoted || target.term === 'background processes') {
      count++;
      console.log(`[workbench] Match #${count} at position ${idx}:`);
      console.log(`  ${context}`);
      if (count >= 10) break;
    }
  }
});
