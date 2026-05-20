import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';

function inspectFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`[${label}] File does not exist.`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  // Note: line 3660 is 1-indexed, so 3659 in 0-indexed array
  const lineIndex = 3659;
  if (lineIndex >= lines.length) {
    console.log(`[${label}] Line 3660 out of bounds (total lines: ${lines.length}).`);
    return;
  }
  const line = lines[lineIndex];
  console.log(`\n================== [${label}] Line 3660 Context ==================`);
  console.log(`Line length: ${line.length}`);
  const targetChar = 14178;
  const start = Math.max(0, targetChar - 200);
  const end = Math.min(line.length, targetChar + 200);
  console.log(`Characters ${start} to ${end}:`);
  const snippet = line.substring(start, end);
  console.log(snippet);
  console.log(`\nExact character at ${targetChar}: ${line[targetChar]}`);
}

inspectFile(backupPath, 'ORIGINAL BACKUP');
inspectFile(targetPath, 'CURRENT MAIN');
