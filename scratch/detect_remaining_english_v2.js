import fs from 'fs';
import path from 'path';

const filesToScan = [
  {
    name: 'main.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak'
  },
  {
    name: 'workbench.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
  },
  {
    name: 'extension.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak'
  }
];

const translationsPath = './translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const translatedOldKeys = new Set(translations.map(t => t.old));

// A set of string literals we want to skip (code-level strings, libraries, etc.)
const skipStrings = new Set([
  'use strict', 'h-4 w-4', 'utf-8', 'utf8', 'div', 'span', 'p', 'a', 'button', 'input', 'select', 'option', 'textarea', 'form',
  'svg', 'path', 'g', 'rect', 'circle', 'line', 'polyline', 'polygon', 'text', 'tspan', 'foreignObject', 'canvas', 'iframe',
  'class', 'className', 'id', 'name', 'type', 'value', 'disabled', 'required', 'readonly', 'multiple', 'checked', 'selected',
  'click', 'hover', 'focus', 'active', 'open', 'close', 'true', 'false', 'null', 'undefined', 'object', 'function', 'string',
  'number', 'boolean', 'symbol', 'bigint', 'none', 'block', 'flex', 'grid', 'inline', 'static', 'absolute', 'relative', 'fixed'
]);

const results = [];

filesToScan.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) {
    console.log(`[WARN] File not found: ${fileInfo.path}`);
    return;
  }
  
  console.log(`Scanning ${fileInfo.name}...`);
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  
  // Patterns to look for UI context:
  // 1. label: "..." or label: '...'
  // 2. title: "..." or title: '...'
  // 3. placeholder: "..." or placeholder: '...'
  // 4. tooltip: "..." or tooltip: '...'
  // 5. description: "..." or description: '...'
  // 6. children: "..." or children: '...'
  // 7. children: [..., "...", ...] or children: [..., '...', ...]
  // 8. p("span", {children: "..."}) or R("span", {children: "..."}) etc.
  
  const regexes = [
    // properties
    /(?:label|title|placeholder|tooltip|description|children)\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    /(?:label|title|placeholder|tooltip|description|children)\s*:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g,
    
    // React children array elements
    /children\s*:\s*\[[^\]]*"([^"\\]*(?:\\.[^"\\]*)*)"[^\]]*\]/g,
    /children\s*:\s*\[[^\]]*'([^'\\]*(?:\\.[^'\\]*)*)'[^\]]*\]/g,
    
    // helper DOM elements (e.g. p("span", {children: "to navigate"}))
    /[pR]\s*\(\s*["']span["']\s*,\s*\{\s*children\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*\}/g,
    /[pR]\s*\(\s*["']span["']\s*,\s*\{\s*children\s*:\s*'([^'\\]*(?:\\.[^'\\]*)*)'\s*\}/g
  ];
  
  regexes.forEach(regex => {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(content)) !== null) {
      const val = match[1];
      if (!val) continue;
      
      const trimmed = val.trim();
      if (trimmed.length < 2) continue;
      
      // Must contain English letters
      if (!/[a-zA-Z]/.test(trimmed)) continue;
      
      // Filter out typical code fragments / non-UI elements
      if (skipStrings.has(trimmed) || skipStrings.has(trimmed.toLowerCase())) continue;
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('file://')) return;
      
      // Check if already translated exactly
      // Also check if any existing translation covers this
      let alreadyHandled = false;
      for (const oldKey of translatedOldKeys) {
        if (oldKey === trimmed || oldKey.includes(match[0]) || match[0].includes(oldKey)) {
          alreadyHandled = true;
          break;
        }
      }
      
      if (alreadyHandled) continue;
      
      const start = Math.max(0, match.index - 50);
      const end = Math.min(content.length, match.index + match[0].length + 50);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      results.push({
        file: fileInfo.name,
        string: trimmed,
        match: match[0],
        context: context,
        pos: match.index
      });
    }
  });
});

// Remove duplicates based on string value
const uniqueResults = [];
const seen = new Set();
results.forEach(r => {
  const key = `${r.file}::${r.match}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueResults.push(r);
  }
});

console.log(`Found ${uniqueResults.length} potential remaining English UI strings.`);

// Write results to a file for human/AI analysis
fs.writeFileSync('scratch/potential_remaining_english_ui.json', JSON.stringify(uniqueResults, null, 2), 'utf8');
console.log('Results written to scratch/potential_remaining_english_ui.json');

// Print first 50 results
uniqueResults.slice(0, 50).forEach((r, idx) => {
  console.log(`${idx+1}. File: ${r.file} | Context Match: ${r.match}`);
  console.log(`   Context: ...${r.context}...`);
  console.log();
});
