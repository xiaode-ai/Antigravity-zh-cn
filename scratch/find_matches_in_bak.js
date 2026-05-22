import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');

const bakContent = fs.readFileSync(bakPath, 'utf8');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

console.log('--- Checking ARTIFACT_REVIEW_MODE in main.js.bak ---');
const term1 = 'Mr.ARTIFACT_REVIEW_MODE';
let idx1 = bakContent.indexOf(term1);
if (idx1 !== -1) {
  console.log(`Found "${term1}" in main.js.bak at index ${idx1}:`);
  console.log(bakContent.substring(idx1 - 100, idx1 + 700));
} else {
  console.log(`"${term1}" not found in main.js.bak`);
}

console.log('\n--- Checking ARTIFACT_REVIEW_MODE in main.js ---');
let idx1_main = mainContent.indexOf(term1);
if (idx1_main !== -1) {
  console.log(`Found "${term1}" in main.js at index ${idx1_main}:`);
  console.log(mainContent.substring(idx1_main - 100, idx1_main + 700));
} else {
  console.log(`"${term1}" not found in main.js`);
}

console.log('\n--- Searching for references to "turbo" or "e0.TURBO" in main.js.bak ---');
// Let's find any occurrences of "Review Policy" or "Artifact Review Policy"
const reviewPolicyTerm = 'Review Policy';
let idx2 = bakContent.indexOf(reviewPolicyTerm);
while (idx2 !== -1) {
  console.log(`Found "${reviewPolicyTerm}" at index ${idx2}:`);
  console.log(bakContent.substring(idx2 - 150, idx2 + 650));
  idx2 = bakContent.indexOf(reviewPolicyTerm, idx2 + 1);
}

const artReviewPolicyTerm = 'Artifact Review Policy';
let idx3 = bakContent.indexOf(artReviewPolicyTerm);
while (idx3 !== -1) {
  console.log(`Found "${artReviewPolicyTerm}" at index ${idx3}:`);
  console.log(bakContent.substring(idx3 - 150, idx3 + 650));
  idx3 = bakContent.indexOf(artReviewPolicyTerm, idx3 + 1);
}
