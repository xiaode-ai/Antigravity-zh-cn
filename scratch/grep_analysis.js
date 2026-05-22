import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('scratch/exact_12_terms_analysis.txt', 'utf8');
const lines = content.split('\n');

lines.forEach(line => {
  if (line.includes('Term:') || line.includes('File:')) {
    console.log(line.trim());
  }
});
