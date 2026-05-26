import fs from 'fs';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak";
const content = fs.readFileSync(filePath, 'utf8');

let pos = content.indexOf("Open Folder");
if (pos !== -1) {
  // 我们在 "Open Folder" 附近找 "Clone" 相关的结构
  const start = Math.max(0, pos - 500);
  const end = Math.min(content.length, pos + 1000);
  console.log("--- OPEN FOLDER NEIGHBORHOOD ---");
  console.log(content.substring(start, end));
}

let mainPath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak";
const mainContent = fs.readFileSync(mainPath, 'utf8');
let mainPos = mainContent.indexOf("Open Folder");
if (mainPos !== -1) {
  const start = Math.max(0, mainPos - 500);
  const end = Math.min(mainContent.length, mainPos + 1000);
  console.log("--- MAIN OPEN FOLDER NEIGHBORHOOD ---");
  console.log(mainContent.substring(start, end));
}
