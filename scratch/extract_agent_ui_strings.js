import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainPath)) {
  console.error(`Missing main.js.bak at ${mainPath}`);
  process.exit(1);
}

const content = fs.readFileSync(mainPath, 'utf8');

// Match patterns like children:"Some Text" or children:['Some Text', ...]
const regex = /children:\s*("[A-Za-z0-9\s\-\.\,\?\!\'\:\(\)\/]+")/g;
const matches = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  matches.add(match[1]);
}

console.log(`Found ${matches.size} children string literals:`);
const sorted = Array.from(matches).sort();
sorted.forEach(m => {
  console.log(m);
});

// Also match patterns like label:"Some Text"
const labelRegex = /label:\s*("[A-Za-z0-9\s\-\.\,\?\!\'\:\(\)\/]+")/g;
const labels = new Set();
while ((match = labelRegex.exec(content)) !== null) {
  labels.add(match[1]);
}

console.log(`\nFound ${labels.size} label string literals:`);
Array.from(labels).sort().forEach(m => {
  console.log(m);
});
