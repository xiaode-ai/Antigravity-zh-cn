import fs from 'fs';
import path from 'path';

const nlsBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak";
if (!fs.existsSync(nlsBak)) {
  console.log("nls.messages.json.bak not found!");
  process.exit(1);
}

const nlsData = JSON.parse(fs.readFileSync(nlsBak, 'utf8'));

const targets = [
  "Clone Repository",
  "Workspaces",
  "Google Extensions",
  "SecureCoder",
  "Set up your AI Security Companion",
  "Google Data Cloud for your intelligent IDE",
  "Get Started",
  "Download"
];

console.log("--- SEARCHING nls.messages.json.bak ---");
targets.forEach(target => {
  const matches = [];
  nlsData.forEach((val, idx) => {
    if (typeof val === 'string' && val.toLowerCase().includes(target.toLowerCase())) {
      matches.push({ index: idx, val: val });
    }
  });
  if (matches.length > 0) {
    console.log(`\n▶ Found matches for "${target}":`);
    matches.forEach(m => {
      console.log(`  Index: ${m.index} => "${m.val}"`);
    });
  } else {
    console.log(`\n▶ No matches found for "${target}"`);
  }
});
