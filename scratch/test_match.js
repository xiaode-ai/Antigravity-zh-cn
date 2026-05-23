import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const workbenchBackupPath = path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const content = fs.readFileSync(workbenchBackupPath, 'utf8');

// The three precise target strings we want to replace
const targets = [
  "s+=`\\`${e}\\` task `;",
  "s+=n.every(l=>l.state===Sv.Idle)?a?`finished with \\`${a}\\` problem${a===1?\"\":\"s\"}`:\"finished\":a?`started and will continue to run in the background with \\`${a}\\` problem${a===1?\"\":\"s\"}`:\"started and will continue to run in the background\"",
  "if(r)return o?new Fi(`Got output for ${s} with \\`${o}\\` problem${o===1?\"\":\"s\"}`):new Fi(`Got output for ${s}`);"
];

targets.forEach((t, i) => {
  console.log(`Target ${i + 1} Found:`, content.includes(t));
  if (content.includes(t)) {
    const idx = content.indexOf(t);
    console.log(`  At index: ${idx}`);
    console.log(`  Context: ... ${content.substring(idx - 20, idx + t.length + 20).replace(/\n/g, ' ')} ...`);
  }
});
