import fs from 'fs';

const content = fs.readFileSync('scratch/untranslated_v5_results.txt', 'utf8');
const sections = content.split('==================== SEARCHING IN');

sections.forEach(section => {
  if (!section.trim()) return;
  const fileName = section.split('\n')[0].trim();
  if (fileName.includes('workbench')) {
    console.log(`\n==================== ${fileName} ====================`);
    const lines = section.split('\n');
    lines.forEach(line => {
      if (line.includes('--- Term: "') || (line.startsWith('[') && line.includes('] Occur') && (line.includes('processes') || line.includes('Terminal')))) {
        console.log(line.substring(0, 300));
      }
    });
  }
});
