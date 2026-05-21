import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('./translations.json', 'utf8'));

let mismatches = 0;
for (let i = 0; i < translations.length; i++) {
  const pair = translations[i];
  const oldText = pair.old;
  const newText = pair.new;

  // Check ending character mismatch (ignoring quotes)
  const cleanOld = oldText.replace(/\\"/g, '"');
  const cleanNew = newText.replace(/\\"/g, '"');

  const oldEndsWithBrace = cleanOld.endsWith('}');
  const newEndsWithBrace = cleanNew.endsWith('}');
  const oldEndsWithBracket = cleanOld.endsWith(']');
  const newEndsWithBracket = cleanNew.endsWith(']');
  const oldEndsWithParen = cleanOld.endsWith(')');
  const newEndsWithParen = cleanNew.endsWith(')');

  if (oldEndsWithBrace !== newEndsWithBrace) {
    console.log(`Mismatch at index ${i}:`);
    console.log(`  Old: ${oldText}`);
    console.log(`  New: ${newText}`);
    console.log(`  Brace mismatch: old=${oldEndsWithBrace}, new=${newEndsWithBrace}\n`);
    mismatches++;
  } else if (oldEndsWithBracket !== newEndsWithBracket) {
    console.log(`Mismatch at index ${i}:`);
    console.log(`  Old: ${oldText}`);
    console.log(`  New: ${newText}`);
    console.log(`  Bracket mismatch: old=${oldEndsWithBracket}, new=${newEndsWithBracket}\n`);
    mismatches++;
  } else if (oldEndsWithParen !== newEndsWithParen) {
    console.log(`Mismatch at index ${i}:`);
    console.log(`  Old: ${oldText}`);
    console.log(`  New: ${newText}`);
    console.log(`  Paren mismatch: old=${oldEndsWithParen}, new=${newEndsWithParen}\n`);
    mismatches++;
  }
}

console.log(`Total structure mismatches found: ${mismatches}`);
