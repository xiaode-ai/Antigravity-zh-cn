import fs from 'fs';

const mainContent = fs.readFileSync('temp_debug_main.js', 'utf8');

const targetIndex = 9110893;
const start = Math.max(0, targetIndex - 8000);
const end = targetIndex + 500;

console.log(mainContent.substring(start, end));
