import fs from 'fs';

const content = fs.readFileSync('scratch/locate_user_request_results_utf8.txt', 'utf8');
const lines = content.split('\n');

const termSummary = {};
lines.forEach(line => {
  if (line.includes('▶ Term:')) {
    const match = line.match(/▶ Term: "([^"]+)" \(Occur #(\d+), Index: (\d+)\)/);
    if (match) {
      const term = match[1];
      const count = parseInt(match[2], 10);
      const index = parseInt(match[3], 10);
      if (!termSummary[term]) {
        termSummary[term] = [];
      }
      termSummary[term].push({ count, index });
    }
  } else if (line.includes('▶ NLS Match:')) {
    const match = line.match(/▶ NLS Match: "([^"]+)" -> Index (\d+): "(.+)"/);
    if (match) {
      const term = match[1];
      const index = parseInt(match[2], 10);
      const val = match[3];
      if (!termSummary[term]) {
        termSummary[term] = [];
      }
      termSummary[term].push({ type: 'NLS', index, val });
    }
  }
});

console.log('=== TERM SEARCH SUMMARY ===');
for (const [term, matches] of Object.entries(termSummary)) {
  const jsMatches = matches.filter(m => m.count !== undefined);
  const nlsMatches = matches.filter(m => m.type === 'NLS');
  console.log(`\nTerm: "${term}"`);
  console.log(`  JS Matches Count: ${jsMatches.length}`);
  if (jsMatches.length > 0) {
    console.log(`  JS Sample Indices: ${jsMatches.slice(0, 5).map(m => m.index).join(', ')}...`);
  }
  console.log(`  NLS Matches Count: ${nlsMatches.length}`);
  if (nlsMatches.length > 0) {
    console.log(`  NLS Sample Indices: ${nlsMatches.slice(0, 5).map(m => m.index).join(', ')}...`);
  }
}
