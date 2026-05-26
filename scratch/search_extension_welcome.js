import fs from 'fs';
import path from 'path';

const extensionBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak";
if (!fs.existsSync(extensionBak)) {
  console.log("extension.js.bak not found!");
  process.exit(1);
}

const content = fs.readFileSync(extensionBak, 'utf8');

const targets = [
  "Clone Repository",
  "Open Folder",
  "Google Extensions",
  "SecureCoder",
  "Set up your AI Security Companion",
  "Google Data Cloud for your intelligent IDE",
  "Get Started",
  "Download"
];

console.log("--- SEARCHING extension.js.bak ---");
targets.forEach(target => {
  let pos = 0;
  let matches = [];
  while ((pos = content.toLowerCase().indexOf(target.toLowerCase(), pos)) !== -1) {
    const start = Math.max(0, pos - 120);
    const end = Math.min(content.length, pos + 180);
    matches.push({ pos: pos, context: content.substring(start, end).replace(/\n/g, ' ') });
    pos += target.length;
  }
  if (matches.length > 0) {
    console.log(`\n▶ Found ${matches.length} matches for "${target}":`);
    matches.forEach((m, idx) => {
      console.log(`  [Match ${idx + 1}] Pos: ${m.pos}`);
      console.log(`    Context: ...${m.context}...`);
    });
  } else {
    console.log(`\n▶ No matches found for "${target}"`);
  }
});
