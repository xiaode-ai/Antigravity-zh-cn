import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('main.js near 9634782:');
console.log(mainContent.substring(9634500, 9635100));

console.log('\nworkbench near 14392358:');
console.log(wbContent.substring(14392100, 14392700));

console.log('\nmain.js near 10264068:');
console.log(mainContent.substring(10263900, 10264300));

console.log('\nworkbench near 14832640:');
console.log(wbContent.substring(14832450, 14832850));
