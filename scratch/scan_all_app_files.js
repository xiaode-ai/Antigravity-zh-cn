import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const results = [];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.json')) {
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
        
        index = 0;
        while (true) {
          index = content.toLowerCase().indexOf('autocompletespeed', index);
          if (index === -1) break;
          results.push(`  "autocompletespeed" Match at index ${index}:`);
          results.push(`  ${content.substring(index - 100, index + 100).replace(/\n/g, ' ')}`);
          index += 17;
        }
      }
    }
  }
}

searchDir(appDir);
fs.writeFileSync('scratch/autocomplete_search_results.txt', results.join('\n'));
console.log("Done. Results saved to scratch/autocomplete_search_results.txt");
