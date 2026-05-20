import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const target = 'Mr.BROWSER_JS_EXECUTION_POLICY';
let idx = content.indexOf(target);
if (idx !== -1) {
  console.log(content.substring(idx - 50, idx + 1000));
}
