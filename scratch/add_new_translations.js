import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original translations count: ${translations.length}`);

// 1. 修改 "By using this app" 条目，使其精确匹配宿主的 `!r.product.isGoogleInternal`
let modifiedCount = 0;
translations = translations.map(t => {
  if (t.old.includes('By using this app, you agree to its')) {
    modifiedCount++;
    return {
      "old": "!r.product.isGoogleInternal&&p(\"div\",{className:\"text-xs text-muted-foreground mt-auto pt-4\",children:[\"By using this app, you agree to its\",\" \",p(\"a\",{href:o?\"https://cloud.google.com/terms\":\"https://antigravity.google/terms\",className:\"text-primary hover:underline\",target:\"_blank\",rel:\"noreferrer\",children:\"Terms of Service\"})]})",
      "new": "!r.product.isGoogleInternal&&p(\"div\",{className:\"text-xs text-muted-foreground mt-auto pt-4\",children:[\"使用本应用即表示您同意其\",\" \",p(\"a\",{href:o?\"https://cloud.google.com/terms\":\"https://antigravity.google/terms\",className:\"text-primary hover:underline\",target:\"_blank\",rel:\"noreferrer\",children:\"服务条款\"})]})"
    };
  }
  return t;
});
console.log(`Modified 'By using this app' count: ${modifiedCount}`);

// 2. 新增的翻译条目
const newEntries = [
  // GCP Project ID Settings
  {
    "old": "[Mr.ENTERPRISE_GCP_PROJECT_ID,{isProviderSetting:!0,screen:\"Permissions\",label:\"[Dev] GCP Project ID\",description:\"GCP Project ID for enterprise features.\",settingType:\"text\",placeholder:\"my-gcp-project-id\",type:\"string\"}]",
    "new": "[Mr.ENTERPRISE_GCP_PROJECT_ID,{isProviderSetting:!0,screen:\"Permissions\",label:\"[开发] GCP 项目 ID\",description:\"用于企业版功能的 GCP 项目 ID。\",settingType:\"text\",placeholder:\"my-gcp-project-id\",type:\"string\"}]"
  },
  // Allow List Terminal Commands Settings
  {
    "old": "[Mr.CASCADE_ALLOWED_COMMANDS,{isProviderSetting:!0,screen:\"Permissions\",label:\"Allow List Terminal Commands\",description:\"Agent auto-executes commands matched by an allow list entry.\"+(e===\"Cider\"?' Only works when Auto-execution policy is set to \"Request Review\" on a go/limited-internet host.':\"\")+\" For Unix shells, an allow list entry matches a command if its space-separated tokens form a prefix of the command's tokens. For PowerShell, the entry tokens may match any contiguous subsequence of the command tokens.\",settingType:\"list\",sortAlphabetically:!0}]",
    "new": "[Mr.CASCADE_ALLOWED_COMMANDS,{isProviderSetting:!0,screen:\"Permissions\",label:\"终端命令白名单\",description:\"智能体自动执行与白名单条目匹配的命令。\"+(e===\"Cider\"?'仅在 go/limited-internet 主机上“自动执行策略”设置为“需要审核”时生效。':\"\")+\" 对于 Unix Shell，若白名单条目以空格分隔的词组构成了命令词组的前缀，则匹配该命令。对于 PowerShell，条目词组可以匹配命令词组的任意连续子序列。\",settingType:\"list\",sortAlphabetically:!0}]"
  },
  // Deny List Terminal Commands Settings
  {
    "old": "[Mr.CASCADE_DENIED_COMMANDS,{isProviderSetting:!0,screen:\"Permissions\",label:\"Deny List Terminal Commands\",description:\"Agent asks for permission before executing commands matched by a deny list entry.\"+(e===\"Cider\"?'Only works when Auto-execution policy is set to \"Request Review\" on a go/limited-internet host.':\"\")+\" The deny list follows the same matching rules as the allow list and takes precedence over the allow list.\",settingType:\"list\",sortAlphabetically:!0}]",
    "new": "[Mr.CASCADE_DENIED_COMMANDS,{isProviderSetting:!0,screen:\"Permissions\",label:\"终端命令黑名单\",description:\"智能体在执行与黑名单条目匹配的命令前会请求许可。\"+(e===\"Cider\"?'仅在 go/limited-internet 主机上“自动执行策略”设置为“需要审核”时生效。':\"\")+\" 黑名单遵循与白名单相同的匹配规则，且优先级高于白名单。\",settingType:\"list\",sortAlphabetically:!0}]"
  }
];

translations.push(...newEntries);
console.log(`Added ${newEntries.length} new entries. Total translations count now: ${translations.length}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Successfully written updates to translations.json!');
