import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

console.log('--- Searching for Search MCP servers by name in main.js.bak ---');
let idx1 = mainContent.indexOf('Search MCP servers by name');
if (idx1 !== -1) {
  console.log(`Found at ${idx1}:`);
  console.log(mainContent.substring(idx1 - 150, idx1 + 250));
} else {
  console.log('Search MCP servers by name NOT found');
}

console.log('\n--- Searching for Enable Antigravity to deploy apps in main.js.bak ---');
let idx2 = mainContent.indexOf('Enable Antigravity to deploy apps');
if (idx2 !== -1) {
  console.log(`Found at ${idx2}:`);
  console.log(mainContent.substring(idx2 - 150, idx2 + 250));
} else {
  console.log('Enable Antigravity to deploy apps NOT found');
}

console.log('\n--- Searching for Firebase Model Context Protocol in main.js.bak ---');
let idx3 = mainContent.indexOf('Firebase Model Context Protocol');
if (idx3 !== -1) {
  console.log(`Found at ${idx3}:`);
  console.log(mainContent.substring(idx3 - 150, idx3 + 250));
} else {
  console.log('Firebase Model Context Protocol NOT found');
}
