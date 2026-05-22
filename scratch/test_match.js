import fs from 'fs';

const wbPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(wbPath, 'utf8');

const target = "Snooze";
let idx = content.indexOf(target);
while (idx !== -1) {
  const context = content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 350));
  if (context.includes("minutes") || context.includes("snoop")) {
    console.log(`Found context at index ${idx}:`);
    console.log(context);
    console.log("Chars of context:");
    let details = "";
    for (let i = 0; i < context.length; i++) {
      details += `${context[i]}[${context.charCodeAt(i)}] `;
    }
    console.log(details);
  }
  idx = content.indexOf(target, idx + 1);
}
