import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const term = 'Ebn=';
const idx = content.indexOf(term);
if (idx !== -1) {
  console.log(`Found Ebn at index ${idx}`);
  console.log(`Context: ${content.substring(idx - 50, idx + 250)}`);
} else {
  // Let's do a search for "Ebn =" or "Ebn=" or something in a wider range
  const regex = /Ebn\s*=/g;
  let match;
  if ((match = regex.exec(content)) !== null) {
    console.log(`Found via regex at index ${match.index}`);
    console.log(`Context: ${content.substring(match.index - 50, match.index + 250)}`);
  } else {
    console.log('Ebn not found');
  }
}
