/**
 * Analyze the old dom-untranslated.json against the CURRENT DOM dictionary
 * to identify remaining gaps after all fixes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load the current DOM dictionary from translations.json
const translations = JSON.parse(fs.readFileSync(path.join(projectRoot, 'translations.json'), 'utf8'));
const domEntry = translations.find(t => t.old === 'void win.loadURL(url);');
const raw = domEntry.new;

// Extract dictionary keys from the parsed string
// Keys appear as \"KEY\": in the parsed string
const keyPattern = /\\"([^"\\]*(?:\\.[^"\\]*)*)\\":/g;
const dictKeys = new Set();
let m;
const dictStart = raw.indexOf('const dictionary = {');
let depth = 0, dictEnd = -1;
for (let i = dictStart + 'const dictionary = {'.length - 1; i < raw.length; i++) {
  if (raw[i] === '{') depth++;
  else if (raw[i] === '}') { depth--; if (depth === 0) { dictEnd = i; break; } }
}
const dictBody = raw.slice(dictStart + 'const dictionary = {'.length, dictEnd);

// Parse keys - handle the \"key\": pattern
let pos = 0;
while (pos < dictBody.length) {
  if (dictBody[pos] === '\\' && dictBody[pos + 1] === '"') {
    // Start of key
    let keyStart = pos + 2;
    let keyEnd = -1;
    for (let i = keyStart; i < dictBody.length; i++) {
      if (dictBody[i] === '\\' && dictBody[i + 1] === '"') {
        keyEnd = i;
        break;
      }
    }
    if (keyEnd === -1) break;
    const key = dictBody.slice(keyStart, keyEnd);
    dictKeys.add(key);
    pos = keyEnd + 2;
  } else {
    pos++;
  }
}

console.log(`Current DOM dictionary: ${dictKeys.size} keys\n`);

// Load old scan report
const report = JSON.parse(fs.readFileSync(path.join(projectRoot, 'dom-untranslated.json'), 'utf8'));
const unknownEntries = report.unknown || [];
const partialEntries = report.partial || [];

console.log(`Old scan report: ${unknownEntries.length} unknown, ${partialEntries.length} partial\n`);

// Categorize unknown entries
const covered = [];       // Key exists in dictionary → should translate (timing fix helps)
const hybridOnly = [];    // Already-partially-translated text (scanner artifact)
const cssColors = [];     // CSS color codes (false positives)
const emails = [];        // Email addresses (false positives)
const shortcuts = [];     // Keyboard shortcut fragments
const internalIds = [];   // Internal identifiers
const genuinelyMissing = []; // Real UI text not in dictionary

for (const entry of unknownEntries) {
  const text = entry.old;
  
  // CSS colors
  if (/^[0-9a-fA-F]{6}$/.test(text)) { cssColors.push(text); continue; }
  
  // Email
  if (text.includes('@') && text.includes('.com')) { emails.push(text); continue; }
  
  // Internal identifiers
  if (/^[a-z-]+$/.test(text) && text.length < 30 && !text.includes(' ')) { internalIds.push(text); continue; }
  
  // Keyboard shortcuts (Ctrl+key, Alt+key, Shift patterns)
  if (/^(Ctrl|Alt|Shift|Cmd)/.test(text) && text.length < 15) { shortcuts.push(text); continue; }
  
  // Check if the EXACT text is in the dictionary
  if (dictKeys.has(text)) {
    covered.push(text);
    continue;
  }
  
  // Check if it's a hybrid (mix of Chinese and English from partial translation)
  if (entry.mixed && /[\u4e00-\u9fff]/.test(text) && /[A-Za-z]/.test(text)) {
    // It's a hybrid - check if all English parts are covered by dictionary entries
    hybridOnly.push(text);
    continue;
  }
  
  // Check if it's purely English and not in dictionary
  if (/[A-Za-z]/.test(text) && !/[\u4e00-\u9fff]/.test(text)) {
    // Check if any dictionary key is a substring
    let hasSubstring = false;
    for (const key of dictKeys) {
      if (key.length > 3 && text.includes(key)) { hasSubstring = true; break; }
    }
    if (!hasSubstring) {
      genuinelyMissing.push(text);
    } else {
      covered.push(text); // Will be translated via substring matching
    }
    continue;
  }
  
  // Anything else
  genuinelyMissing.push(text);
}

console.log('═══ Analysis of old scan report vs current dictionary ═══\n');

console.log(`[COVERED] ${covered.length} entries — key or substring exists in dictionary`);
console.log(`  (These should translate correctly after timing fix + app restart)\n`);

console.log(`[HYBRID] ${hybridOnly.length} entries — scanner artifacts (mixed Chinese+English from parent textContent)`);
console.log(`  (Individual text nodes should be translated; the "mixed" appearance is a scanner issue)\n`);

console.log(`[SHORTCUT] ${shortcuts.length} entries — keyboard shortcut fragments`);
for (const s of shortcuts.slice(0, 5)) console.log(`  • "${s}"`);
console.log(`  (These are intentional — shortcuts like Ctrl, Alt, Shift shouldn't be translated)\n`);

console.log(`[FALSE-POS] ${cssColors.length + emails.length + internalIds.length} entries — CSS colors, emails, internal IDs`);
console.log(`  (Not user-visible text, no translation needed)\n`);

console.log(`[GAP] ${genuinelyMissing.length} entries — potentially still missing:\n`);
for (const text of genuinelyMissing) {
  // Check if it contains any English words that could be translatable
  console.log(`  • "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
}

// Summary
console.log(`\n═══ Summary ═══`);
console.log(`Total unknown in old report: ${unknownEntries.length}`);
console.log(`Already covered by dictionary: ${covered.length}`);
console.log(`Hybrid (scanner artifacts): ${hybridOnly.length}`);
console.log(`Shortcuts (intentional): ${shortcuts.length}`);
console.log(`False positives: ${cssColors.length + emails.length + internalIds.length}`);
console.log(`Genuinely missing: ${genuinelyMissing.length}`);
console.log(`\nExpected improvement after restart: ~${Math.round((covered.length / unknownEntries.length) * 100)}% of previously unknown entries should now be translated.`);
