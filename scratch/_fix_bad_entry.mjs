// Fix: remove the incorrectly-escaped Show "Edit" entry from DOM dictionary
import fs from 'fs';

const translationsPath = 'C:/Users/i-cgh/Documents/GitHub/Antigravity-zh-cn/translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const domEntry = translations.find(p => p.old === 'void win.loadURL(url);');
let s = domEntry.new;

// The bad entry was added with only 2 backslashes (\\" instead of \\\" for quotes)
// Find it by looking for the pattern with 2 backslashes: \\"编辑\\"
// vs the correct pattern with 3 backslashes: \\\"编辑\\\"

// In the raw string (after JSON.parse):
// Correct: \\\"编辑\\\"  (3 chars: \ \ " before 编辑)
// Bad:     \\"编辑\\"   (2 chars: \ " before 编辑, but " terminates the JS string)

// The bad entry starts with: ,\"Show \\"编辑\\"
// Let's find it by looking for ,"Show \\" (with exactly 2 backslashes after Show)
// vs the correct one: ,"Show \\\" (3 backslashes)

// In the string:
// Correct pattern contains: Show \\\"
// Bad pattern contains: Show \\"

// Find the bad entry by searching for the wrong escape pattern
const badStart = 'Show \\\\"'; // Show followed by 2 backslashes + quote
const correctStart = 'Show \\\\\\"'; // Show followed by 3 backslashes + quote

// Find all occurrences of 'Show \\' pattern
let idx = 0;
let found = [];
while (true) {
  idx = s.indexOf('Show ', idx);
  if (idx === -1) break;
  const after = s.substring(idx + 5, idx + 15);
  found.push({ pos: idx, after: JSON.stringify(after) });
  idx++;
}

console.log('All "Show " occurrences:');
found.forEach((f, i) => {
  console.log('  ' + (i + 1) + '. pos ' + f.pos + ': after = ' + f.after);
});

// The bad entry has Show followed by \\" (2 backslashes in the raw string)
// Let's find it more precisely
const badPattern = 'Show \\\\"'; // In raw string: Show + backslash + backslash + quote
let badIdx = -1;

// Scan for the wrong pattern
for (let i = 0; i < s.length - 10; i++) {
  if (s.substring(i, i + 5) === 'Show ' && s[i + 5] === '\\' && s[i + 6] === '\\' && s[i + 7] === '"') {
    // Check it's NOT the correct pattern (which has 3 backslashes)
    if (s[i + 7] === '"' && (i + 8 >= s.length || s[i + 8] !== '\\')) {
      // Wait, need to check more carefully. The correct pattern is Show \\\"
      // which in raw string is: Show, \, \, \, "
      // The bad pattern is: Show, \, \, "
      // So if s[i+5]=\, s[i+6]=\, s[i+7]=\ -> correct (3 backslashes)
      // if s[i+5]=\, s[i+6]=\, s[i+7]=" -> bad (2 backslashes)
      if (s[i + 7] === '"' && s[i + 6] === '\\' && s[i + 5] === '\\') {
        // Check it's not preceded by another backslash
        if (i + 4 < 0 || s[i + 4] !== '\\') {
          // This is actually wrong logic. Let me reconsider.
          // At position i, we have "Show " (5 chars)
          // i+5, i+6, i+7 are the next 3 chars
          // If they are \, \, " -> 2 backslashes then quote -> BAD
          // If they are \, \, \ -> 3 backslashes then quote at i+8 -> CORRECT
        }
      }
    }
  }
}

// Simpler approach: find all "Show " and check how many backslashes follow
console.log('\nDetailed analysis:');
for (const f of found) {
  const raw = s.substring(f.pos, f.pos + 20);
  const backslashes = raw.match(/Show (\\+)"/);
  if (backslashes) {
    console.log('  pos ' + f.pos + ': ' + backslashes[1].length + ' backslashes before quote');
    console.log('  raw: ' + JSON.stringify(raw));
    if (backslashes[1].length === 2) {
      badIdx = f.pos;
      console.log('  ** THIS IS THE BAD ENTRY **');
    }
  }
}

if (badIdx === -1) {
  console.log('\nBad entry not found! Maybe already removed.');
  process.exit(0);
}

// Now find the full bad entry to remove (including leading comma)
// The entry starts with: ,"Show \\"编辑\\" and \\"Chat\\" buttons when selecting text in the editor.":"在编辑器中选择文本时显示\\"编辑\\"和\\"对话\\"按钮。"
// We need to find the comma before it and remove everything up to and including the closing quote

// Find the comma before the bad entry
const commaIdx = s.lastIndexOf(',', badIdx);
// Find the end of this entry (next comma or end of dict)
// The entry value ends with: 按钮。"
// After the value closing quote, there should be a comma or }
const endMarker = '按钮。\\"';
const endIdx = s.indexOf(endMarker, badIdx);

if (endIdx === -1) {
  console.log('Could not find end of bad entry!');
  process.exit(1);
}

const endOfEntry = endIdx + endMarker.length;
const removedText = s.substring(commaIdx, endOfEntry);

console.log('\nRemoving from pos ' + commaIdx + ' to ' + endOfEntry + ':');
console.log('  Text: ' + JSON.stringify(removedText));

// Remove the bad entry
domEntry.new = s.substring(0, commaIdx) + s.substring(endOfEntry);

// Verify
const verifyResult = domEntry.new;
const newBadCheck = verifyResult.includes('Show \\\\"');
const correctStillThere = verifyResult.includes('Show \\\\\\"');

console.log('\nVerification:');
console.log('  Bad pattern still present: ' + newBadCheck);
console.log('  Correct pattern still present: ' + correctStillThere);

// Write back
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('\n[OK] translations.json updated!');

// JSON verify
try {
  JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  console.log('[OK] JSON syntax valid');
} catch (e) {
  console.error('[CRITICAL] JSON syntax error: ' + e.message);
}
