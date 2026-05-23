import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

// We want to find the definition of Mo.AUTOCOMPLETE_SPEED or the definition of Mo object.
// Let's search for "AUTOCOMPLETE_SPEED:" or similar inside the file.
const regex = /AUTOCOMPLETE_SPEED\s*:/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 200, index + 300).replace(/\n/g, ' '));
}

// Also let's find references to the string values "Fast" and "Slow" in the context of setting options.
// Or we can search for the definition of Fwe.FAST or Fwe.SLOW or Fwe.DEFAULT.
const regexFwe = /Fwe\s*=\s*/g;
while ((match = regexFwe.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nFwe definition Match at index ${index}:`);
  console.log(content.substring(index - 100, index + 300).replace(/\n/g, ' '));
}
