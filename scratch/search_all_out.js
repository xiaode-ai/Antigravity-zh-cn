import fs from 'fs';
import path from 'path';

const searchDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';

const terms = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Editor-Specific Settings',
  'Profile',
  'Move changes to main',
  'Good response',
  'Bad response',
  'files changed',
  'Review',
  'Worked for',
  'Thought for',
  'Explored 1 task',
  'Explored 1 search',
  'Explored 1 folder',
  'Explored 1 file'
];

function searchInDir(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return;
  }
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }
    
    if (stat.isDirectory()) {
      searchInDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.js', '.json', '.html', '.css'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          terms.forEach(term => {
            if (content.includes(term)) {
              console.log(`[MATCH] "${term}" in file: ${fullPath}`);
            }
          });
        } catch (e) {
          // ignore read error
        }
      }
    }
  }
}

console.log(`Starting recursive search in ${searchDir}...`);
searchInDir(searchDir);
console.log('Search finished.');
