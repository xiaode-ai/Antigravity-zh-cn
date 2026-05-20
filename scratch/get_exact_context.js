import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const targetStr = 'screen:"Permissions",label:"Terminal Command Auto Execution"';
const startIdx = content.indexOf(targetStr);

if (startIdx !== -1) {
  const endMarker = 'default:return"Proceed in Sandbox"}}';
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx !== -1) {
    const exactSub = content.substring(startIdx, endIdx + endMarker.length);
    console.log('EXACT OLD SUBSTRING:');
    console.log(JSON.stringify(exactSub));
  } else {
    console.log('Could not find end marker');
  }
} else {
  console.log('Could not find start target');
}
