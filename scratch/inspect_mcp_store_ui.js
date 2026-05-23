import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const normalWbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const wbFile = fs.existsSync(wbPath) ? wbPath : normalWbPath;
console.log('Reading from:', wbFile);
const content = fs.readFileSync(wbFile, 'utf8');

const targetIdx = content.indexOf('MCP Store');
if (targetIdx !== -1) {
  const start = Math.max(0, targetIdx - 3000);
  const end = Math.min(content.length, targetIdx + 3000);
  console.log('Context of "MCP Store":');
  console.log(content.substring(start, end));
} else {
  console.log('Could not find "MCP Store" in file.');
}
