import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

function inspectAround(content, term, filename) {
  console.log(`\n================ INSPECTING AROUND "${term}" IN ${filename} ================`);
  const idx = content.indexOf(term);
  if (idx === -1) {
    console.log(`Not found in ${filename}`);
    return;
  }
  const start = Math.max(0, idx - 1500);
  const end = Math.min(content.length, idx + term.length + 1500);
  const chunk = content.substring(start, end);
  
  // Find all double-quoted and single-quoted string literals in the chunk
  const doubleQuoteRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  const singleQuoteRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  const backtickRegex = /`([^`\\]*(?:\\.[^`\\]*)*)`/g;
  
  const matches = new Set();
  
  let m;
  while ((m = doubleQuoteRegex.exec(chunk)) !== null) {
    if (m[1] && m[1].trim().length > 1 && /[a-zA-Z]/.test(m[1])) {
      matches.add(m[1]);
    }
  }
  while ((m = singleQuoteRegex.exec(chunk)) !== null) {
    if (m[1] && m[1].trim().length > 1 && /[a-zA-Z]/.test(m[1])) {
      matches.add(m[1]);
    }
  }
  while ((m = backtickRegex.exec(chunk)) !== null) {
    if (m[1] && m[1].trim().length > 1 && /[a-zA-Z]/.test(m[1])) {
      matches.add(m[1]);
    }
  }
  
  console.log("Found English-like string literals in this area:");
  Array.from(matches).sort().forEach(str => {
    // Skip common class names or short css/svg words
    if (str.includes('-') || str.includes(' ') || str.length > 5) {
      console.log(` - "${str}"`);
    }
  });
}

inspectAround(mainContent, "Pages currently open in Antigravity's Browser instance are shown below.", 'main.js.bak');
inspectAround(wbContent, "Pages currently open in Antigravity's Browser instance are shown below.", 'workbench.desktop.main.js.bak');
