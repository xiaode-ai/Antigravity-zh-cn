import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function findAndPrint(content, name, keyword) {
  console.log(`\n=== [${keyword}] in ${name} ===`);
  let idx = content.indexOf(keyword);
  if (idx !== -1) {
    console.log(content.substring(idx - 150, idx + 250));
  } else {
    console.log('Not found');
  }
}

findAndPrint(mainContent, 'main.js', "Your plan's baseline quota");
findAndPrint(wbContent, 'workbench', "Your plan's baseline quota");

findAndPrint(mainContent, 'main.js', "Enable Overages");
findAndPrint(wbContent, 'workbench', "Enable Overages");

findAndPrint(mainContent, 'main.js', "See plans.");
findAndPrint(wbContent, 'workbench', "See plans.");

findAndPrint(mainContent, 'main.js', "Individual quota reached");
findAndPrint(wbContent, 'workbench', "Individual quota reached");
