import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const queries = [
  'children:"Approve"',
  'children:"Deny"',
  'promptText:"Approve?"',
  'children:"Reject"',
  'children:"Accept"',
  'children:"Reject all"',
  'children:"Reject All"',
  'label:"Always Allow"',
  'label:"Allow Once"',
  'label:"Allow once"',
  'label:"Deny"',
  'tooltip:"Stop All Subagents"',
  'disabledReason:"JavaScript execution disabled in strict mode"',
  'isAllowed:t,disabledReason:t?"Disabled in strict mode":"Requires limited-internet host."',
  'label:"Ask first"',
  'label:"Ask every time"',
  'label:"Always run"',
  'label:"Disabled"',
  'promptText:"Send command input?"',
  'n.isAccept?"Accepted":"Rejected"',
  'yFi(e,t){',
  'children:"Read URL rejected"',
  'auto_awesome",size:12}),"New Workspace"]',
  'children:"New Workspace"',
  'title:i?"New Workspace":"New Worktree"',
  'Allow in Conversation',
  'Always Allow',
  'Allow Once',
  'Allow Options',
  'Always Allow',
  'Allow options'
];

queries.forEach(query => {
  console.log(`\n================ QUERY: ${query} ================`);
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(query, idx);
    if (idx === -1) break;
    count++;
    console.log(`[MATCH #${count}] Index: ${idx}`);
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + query.length + 100);
    console.log(content.substring(start, end));
    idx += query.length;
  }
  if (count === 0) {
    console.log('NOT FOUND');
  }
});
