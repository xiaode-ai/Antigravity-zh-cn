import fs from 'fs';
const data = JSON.parse(fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json', 'utf8'));

const targets = [
  '{0} second ago',
  '{0} seconds ago',
  '{0} minute ago',
  '{0} minutes ago',
  '{0} hour ago',
  '{0} hours ago',
  '{0} day ago',
  '{0} days ago',
  'now'
];

targets.forEach(t => {
  const idx = data.indexOf(t);
  if (idx !== -1) {
    console.log(`Index of "${t}": ${idx} -> Current: "${data[idx]}"`);
  } else {
    // try case-insensitive or partial
    const matches = [];
    data.forEach((val, i) => {
      if (typeof val === 'string' && val.toLowerCase().includes(t.toLowerCase())) {
        matches.push({ index: i, value: val });
      }
    });
    console.log(`No exact match for "${t}". Partial matches:`, matches.slice(0, 5));
  }
});
