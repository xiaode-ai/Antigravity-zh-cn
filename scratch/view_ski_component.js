import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const targets = [
  'Mr.AGENT_BROWSER_TOOLS',
  'Mr.BROWSER_JS_EXECUTION_POLICY'
];

targets.forEach(target => {
  console.log(`\n=== Searching for: "${target}" ===`);
  let idx = content.indexOf(target);
  if (idx !== -1) {
    console.log(content.substring(idx - 50, idx + 600));
  } else {
    console.log('NOT FOUND');
  }
});
