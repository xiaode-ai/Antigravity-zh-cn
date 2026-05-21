import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

// Find the function that contains this Email label
const emailPos = content.indexOf('label:"Email",description:a?');
// Search backwards for the function start pattern like ({...})=> or function(
let searchStart = Math.max(0, emailPos - 3000);
let chunk = content.substring(searchStart, emailPos);

// Find the last arrow function or regular function definition
const arrowMatch = chunk.lastIndexOf('=>{');
const funcMatch = chunk.lastIndexOf('function');
const closestFunc = Math.max(arrowMatch, funcMatch);

if (closestFunc !== -1) {
  // Get from function start to email label
  const funcStart = searchStart + closestFunc;
  // Go back a bit more to get the parameter list
  const paramStart = Math.max(0, funcStart - 300);
  console.log('=== Function context ===');
  console.log(content.substring(paramStart, funcStart + 100));
}
