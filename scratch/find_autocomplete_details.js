import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

// Let's find occurrences of case-insensitive "autocompletespeed", "autocomplete speed", "fast", "slow"
console.log("Searching for autocompleteSpeed references:");
const regex1 = /autocompleteSpeed/gi;
let match;
while ((match = regex1.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 150, index + 150).replace(/\n/g, ' '));
}

console.log("\nSearching for 'Autocomplete Speed' literal or similar strings:");
const regex2 = /Autocomplete Speed/gi;
while ((match = regex2.exec(content)) !== null) {
  const index = match.index;
  console.log(`\nMatch at index ${index}:`);
  console.log(content.substring(index - 150, index + 150).replace(/\n/g, ' '));
}
