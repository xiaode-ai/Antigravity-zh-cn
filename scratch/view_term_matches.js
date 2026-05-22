import fs from 'fs';
const data = fs.readFileSync('scratch/term_matches.txt');
console.log('Byte length:', data.length);
// Check if UTF-16LE or UTF-8
const utf8Str = data.toString('utf8');
console.log('UTF-8 preview:', utf8Str.substring(0, 500));
const utf16Str = data.toString('utf16le');
console.log('UTF-16LE preview:', utf16Str.substring(0, 500));
