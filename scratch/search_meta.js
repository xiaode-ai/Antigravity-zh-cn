import fs from 'fs';

const mainContent = fs.readFileSync('temp_debug_main.js', 'utf8');

// Find function Y7i or Y7i =
let index = 0;
while (true) {
  const idx = mainContent.indexOf('Y7i=', index);
  if (idx === -1) break;
  console.log(`\nFound Y7i= at index ${idx}:`);
  const start = Math.max(0, idx - 100);
  const end = Math.min(mainContent.length, idx + 800);
  console.log(mainContent.substring(start, end));
  index = idx + 1;
}
