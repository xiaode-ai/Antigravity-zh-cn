import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const normalWbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const wbFile = fs.existsSync(wbPath) ? wbPath : normalWbPath;
const content = fs.readFileSync(wbFile, 'utf8');

const targetIdx = content.indexOf('No MCP servers installed.');
if (targetIdx !== -1) {
  const start = Math.max(0, targetIdx - 1000);
  const end = Math.min(content.length, targetIdx + 2000);
  console.log('Context of "No MCP servers installed.":');
  console.log(content.substring(start, end));
} else {
  console.log('Could not find targetIdx in file.');
}
