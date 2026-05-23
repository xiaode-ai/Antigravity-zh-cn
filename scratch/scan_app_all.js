import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';
const results = [];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.json')) {
      // Avoid scanning node_modules if we can, or scan everything? Let's skip node_modules to be fast and clean.
      if (fullPath.includes('node_modules')) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('autocomplete speed') || content.toLowerCase().includes('autocompletespeed')) {
        results.push(`Found match in: ${fullPath}`);
        
        let index = 0;
        while (true) {
          index = content.toLowerCase().indexOf('autocomplete speed', index);
          if (index === -1) break;
          results.push(`  "autocomplete speed" Match at index ${index}:`);
          results.push(`  ${content.substring(index - 100, index + 100).replace(/\n/g, ' ')}`);
          index += 18;
        }
      }
    }
  }
}

searchDir(appDir);
fs.writeFileSync('scratch/autocomplete_app_search.txt', results.join('\n'));
console.log("Search completed. Results saved to scratch/autocomplete_app_search.txt");
