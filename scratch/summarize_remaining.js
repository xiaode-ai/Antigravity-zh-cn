import fs from 'fs';

const candidates = JSON.parse(fs.readFileSync('scratch/filtered_ui_candidates.json', 'utf8'));

const short = [];
const long = [];

candidates.forEach(c => {
  if (c.string.length < 35) {
    short.push(c);
  } else {
    long.push(c);
  }
});

let out = '';

out += `=== Short Candidates (${short.length}) ===\n`;
short.forEach((c, idx) => {
  out += `${idx+1}. ["${c.string}"] (from ${c.file}) | Context: ${c.match}\n`;
});

out += `\n=== Long Candidates (${long.length}) ===\n`;
long.forEach((c, idx) => {
  out += `${idx+1}. ["${c.string}"] (from ${c.file}) | Context: ${c.match}\n`;
});

fs.writeFileSync('scratch/summarized_remaining.txt', out, 'utf8');
console.log('Results written to scratch/summarized_remaining.txt');
