import fs from 'fs';

const candidates = JSON.parse(fs.readFileSync('scratch/potential_remaining_english_ui.json', 'utf8'));

// Filter out flowchart shape descriptions
const filtered = candidates.filter(c => {
  if (c.string.includes('shape') || c.string.includes('Represents') || c.string.includes('point') || c.string.includes('storage') || c.string.includes('step') || c.string.includes('document') || c.string.includes('Comment') || c.string.includes('comment') || c.string.includes('link') || c.string.includes('operation')) {
    return false;
  }
  // Shape names
  const shapeNames = ['Rectangle', 'Circle', 'Stadium', 'Cylinder', 'Diamond', 'Hexagon', 'Trapezoid', 'Hourglass', 'Curly Brace', 'Lightning Bolt', 'Triangle', 'Window Pane', 'Pentagon', 'Trapezoidal', 'Sloped', 'Stacked'];
  if (shapeNames.some(name => c.string.includes(name))) {
    return false;
  }
  return true;
});

console.log(`Filtered down to ${filtered.length} candidates.`);
filtered.forEach((r, idx) => {
  console.log(`${idx+1}. File: ${r.file} | Match: ${r.match}`);
  console.log(`   String: "${r.string}"`);
  console.log(`   Context: ...${r.context}...`);
  console.log();
});
