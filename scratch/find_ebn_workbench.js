import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const regex = /folders:\["folder","folders"\]/g;
let match;
if ((match = regex.exec(content)) !== null) {
  console.log(`Found equivalent map at index ${match.index}`);
  console.log(`Context: ${content.substring(match.index - 50, match.index + 250)}`);
} else {
  console.log('Not found by standard folders regex. Trying broad regex...');
  const regex2 = /files:\["file","files"\],folders:\[/g;
  let match2 = regex2.exec(content);
  if (match2) {
    console.log(`Found via broad regex at index ${match2.index}`);
    console.log(`Context: ${content.substring(match2.index - 50, match2.index + 250)}`);
  } else {
    console.log('Broad regex also not found');
  }
}
