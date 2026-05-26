import fs from 'fs';

const nlsBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak";
const nlsData = JSON.parse(fs.readFileSync(nlsBak, 'utf8'));

console.log("3870:", nlsData[3870]);
console.log("3867:", nlsData[3867]);
console.log("3868:", nlsData[3868]);
console.log("3869:", nlsData[3869]);
console.log("14743:", nlsData[14743]);
console.log("14744:", nlsData[14744]);
