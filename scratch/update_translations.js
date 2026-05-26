import fs from 'fs';
import path from 'path';

const filePath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\translations.json';

const mcpDict = {
  "cloud run": { title: "Cloud Run", desc: "允许 Antigravity 部署应用到 Google Cloud Run。" },
  "kubernetes": { title: "Google Kubernetes Engine (OSS)", desc: "允许 Antigravity 与 Google Kubernetes Engine (GKE) 进行交互。" },
  "gke": { title: "Google Kubernetes Engine (OSS)", desc: "允许 Antigravity 与 Google Kubernetes Engine (GKE) 进行交互。" },
  "dart": { title: "Dart", desc: "Dart 与 Flutter MCP 服务端向兼容的 AI 助手客户端暴露 Dart (及 Flutter) 开发工具操作。" },
  "firebase": { title: "Firebase", desc: "Firebase 模型上下文协议 (MCP) 服务端赋予 AI 驱动 of 开发工具协同您的 Firebase 项目及应用代码库工作的能力。" },
  "genkit": { title: "Genkit", desc: "Genkit 模型上下文协议 (MCP) 服务端赋予 AI 驱动的开发工具构建、调试以及巡检您的 Genkit 应用的能力。" },
  "bigquery": { title: "BigQuery", desc: "使用自然语言与您的 BigQuery 数据交互。该 MCP 服务端允许您安全地连接至您的数据集以检索数据集、巡检表结构并执行查询。" },
  "alloydb": { title: "AlloyDB for PostgreSQL", desc: "使用自然语言与您的 AlloyDB for PostgreSQL 数据交互。该 MCP 服务端允许您安全地连接至您的数据库以执行 SQL 查询、巡检表结构并检索数据集。" },
  "bigtable": { title: "Google Cloud Bigtable Admin", desc: "Bigtable 管理远程 MCP 服务端，允许您管理 Bigtable 资源。" },
  "spanner": { title: "Google Cloud Spanner", desc: "使用自然语言与您的 Google Cloud Spanner 数据库交互。该 MCP 服务端允许您安全地连接至 Spanner 数据库以执行 SQL 查询并检索数据集。" },
  "google cloud sql": { title: "Google Cloud SQL", desc: "使用自然语言与您的 Google Cloud SQL 数据库交互。该 MCP 服务端允许您安全地连接至您的数据库以执行 SQL 查询、巡检结构并检索数据集。" },
  "sql": { title: "Google Cloud SQL", desc: "使用自然语言与您的 Google Cloud SQL 数据库交互。该 MCP 服务端允许您安全地连接至您的数据库以执行 SQL 查询、巡检结构并检索数据集。" },
  "storage": { title: "Google Cloud Storage", desc: "允许 Antigravity 访问并管理您的 Google Cloud Storage (GCS) 存储桶和文件资源。" },
  "gcs": { title: "Google Cloud Storage", desc: "允许 Antigravity 访问并管理您的 Google Cloud Storage (GCS) 存储桶和文件资源。" },
  "pubsub": { title: "Google Cloud Pub/Sub", desc: "允许 Antigravity 交互并管理您的 Google Cloud Pub/Sub 主题、订阅及消息流。" },
  "pub/sub": { title: "Google Cloud Pub/Sub", desc: "允许 Antigravity 交互并管理您的 Google Cloud Pub/Sub 主题、订阅及消息流。" },
  "looker": { title: "Looker", desc: "将您的 AI 助手连接到 Looker 商业智能。该 MCP 服务端支持通过执行自然语言查询、运行已保存的 Look、创建和管理仪表板以及在 Looker 环境中执行实例健康检查，来进行数据探索和内容管理。" },
  "knowledge catalog": { title: "Knowledge Catalog", desc: "将您的 AI 助手连接到 Knowledge Catalog（前称为 Dataplex）。该 MCP 服务端通过允许您搜索数据资产、检索详细的元数据（如模式和所有权）以及探索分布式数据中的方面类型，来实现数据发现和治理。" },
  "mcp toolbox for databases": { title: "MCP Toolbox for Databases", desc: "MCP Toolbox for Databases 是一个开源的 MCP 服务端，旨在简化并保障与数据库交互工具开发的安全性。" },
  "oracle": { title: "Oracle Database", desc: "使用自然语言与您的 Oracle Database 数据交互。该 MCP 服务端允许您安全地连接至您的数据库以执行 SQL 查询、巡检表结构并直接从您的 AI 工具中排查数据库性能问题。" },
  "figma dev mode": { title: "Figma Dev Mode MCP", desc: "Dev Mode MCP 服务端通过向根据 Figma 设计文件生成代码的 AI 智能体提供重要的设计信息和上下文，将 Figma 直接引入您的工作流。" },
  "figma": { title: "Figma Dev Mode MCP", desc: "Dev Mode MCP 服务端通过向根据 Figma 设计文件生成代码 of AI 智能体提供重要的设计信息和上下文，将 Figma 直接引入您的工作流。" },
  "github": { title: "GitHub", desc: "GitHub MCP 服务端，允许 AI 助手管理您的 GitHub 仓库、Issues、Pull Requests 以及执行代码库检索。" },
  "neon": { title: "Neon", desc: "Neon MCP 服务端是一个开源工具，允许您使用自然语言与您的 Neon Postgres 数据库交互。" },
  "stripe": { title: "Stripe", desc: "Stripe 模型上下文协议服务端允许您通过函数调用与 Stripe API 进行集成。该协议支持通过各种工具来与不同的 Stripe 服务交互。" },
  "redis": { title: "Redis", desc: "与 Redis 键值存储交互。" },
  "mongodb": { title: "MongoDB", desc: "用于与 MongoDB Atlas 交互的模型上下文协议服务端。" },
  "notion": { title: "Notion", desc: "Notion 官方 MCP 服务端，允许通过 Notion API 与 Notion 工作区、页面、数据库和评论进行交互。" },
  "linear": { title: "Linear", desc: "Linear.app 官方 MCP 服务端，用于与 Linear 项目、任务（Issues）和工作流进行交互。" },
  "perplexity": { title: "Perplexity Ask", desc: "集成了 Perplexity Sonar API 的 MCP 服务端实现，提供实时的全网搜索与研究能力。" },
  "paypal": { title: "PayPal", desc: "PayPal 官方 MCP 服务端，允许集成 PayPal API 以进行支付处理、交易管理和账户操作。" },
  "heroku": { title: "Heroku", desc: "Heroku 平台 MCP 服务端实现与 Heroku 平台资源的无缝交互，允许大语言模型读取、管理和操作应用、插件、数据库等。" },
  "pinecone": { title: "Pinecone", desc: "Pinecone MCP 服务端允许 AI 工具搜索 Pinecone 文档、配置索引、根据您的索引配置生成代码，以及在您的 Pinecone 索引中插入/搜索数据。" },
  "supabase": { title: "Supabase", desc: "将您的 Supabase 项目连接到 AI 助手。该 MCP 服务端允许管理表、获取配置、执行 SQL 查询、管理 Edge 函数以及处理您 Supabase 项目中的数据库架构。" },
  "prisma": { title: "Prisma", desc: "Prisma MCP 服务端允许 AI 工具与 Prisma 交互，以轻松创建和管理 Postgres 数据库。" },
  "locofy": { title: "Locofy", desc: "Locofy MCP 服务端允许将 Locofy.ai 代码与您的 IDE 进行集成和扩展。" },
  "airweave": { title: "Airweave", desc: "Airweave 允许智能体搜索任何应用。" },
  "atlassian": { title: "Atlassian", desc: "用于与 Atlassian 产品交互的 Atlassian MCP 服务端。" },
  "harness": { title: "Harness", desc: "Harness MCP 服务端允许 AI 助手与 Harness 平台 API 进行交互，为软件交付和云运营提供智能自动化与协助。" },
  "sonarqube": { title: "SonarQube", desc: "SonarQube MCP 服务端允许 AI 助手与 SonarQube 实例交互，以进行代码质量分析、项目管理和质量门限操作。" },
  "netlify": { title: "Netlify", desc: "Netlify MCP 服务端允许 AI 助手与 Netlify 平台交互，以管理网站、部署、域名及其他 Web 开发工作流。" },
  "sequential thinking": { title: "Sequential Thinking", desc: "提供结构化思维与推理能力以支持大语言模型对话的模型上下文协议服务端。" },
  "sonatype": { title: "Sonatype Guide", desc: "用于与我们的依赖项管理和安全情报平台交互的 Sonatype MCP 服务端。" },
  "google maps": { title: "Google Maps Platform Code Assist", desc: "Google Maps Platform 代码助手 MCP 服务端为您的 AI 编码助手提供最新、官方的 Google Maps Platform 文档、代码示例和最佳实践。通过让您的 AI 助手基于官方资源工作，它可以生成更准确、可靠且有用的代码。" },
  "arizetracing": { title: "ArizeTracingAssistant", desc: "该 MCP 服务端为您的 LLM 提供文档和示例，以便使用 Arize AX 对您的 AI 应用进行插桩。它还提供获取 Arize 支持的通道。将其连接到您的 IDE 或 LLM，即可获得精选的追踪示例、最佳实践和 Arize 支持！" },
  "postman": { title: "Postman", desc: "Postman MCP 服务端将 Postman 连接到 AI 工具，使 AI 智能体和助手能够通过自然语言交互访问工作区、管理集合和环境、评估 API 以及自动化工作流。" },
  "stitch": { title: "Stitch", desc: "Stitch MCP 服务端允许 AI 助手与 Stitch 进行交互以进行交互设计：通过文本和图像生成 UI 设计，并访问项目与屏幕详情。详情请参阅 https://stitch.withgoogle.com/docs。" },
  "devtools": { title: "Chrome DevTools MCP", desc: "允许 Antigravity 控制并检查正在运行的 Chrome 浏览器，借助强大的 Chrome DevTools 实现可靠的自动化、深度调试和性能分析。" },
  "developer knowledge": { title: "Google Developer Knowledge", desc: "Google 开发者知识库 MCP 服务端赋予 AI 驱动的开发工具搜索 Google 官方开发文档并检索 Firebase、Google Cloud、Android、地图等 Google 产品信息的能力。通过将您的 AI 应用直接连接到我们的官方文档库，确保您收到的代码和指南都是最新且基于权威上下文的。" },
  "clickhouse": { title: "ClickHouse", desc: "ClickHouse MCP 服务端允许智能体安全地与 ClickHouse 数据库进行交互。它提供了一个通用接口来执行 SQL、探索数据以及查看备份与计费详情，使智能体工具能够充分利用 ClickHouse 的高性能分析能力。" },
  "compute engine": { title: "Google Compute Engine", desc: "执行一系列基础设施管理任务，包括：管理虚拟机 (VM) 实例、管理实例组管理器和实例模板、管理磁盘和快照，以及检索关于预留和承诺的信息。" },
  "android management": { title: "Android Management API", desc: "使用针对设备群的自然语言查询来访问企业移动数据，实现策略合规性的自动审计，并将设备管理数据集成到更广泛的自动化工作流中。" },
  "resource manager": { title: "Google Cloud Resource Manager", desc: "使用自然语言搜索您的 Google Cloud 项目。" },
  "vertex ai": { title: "Vertex AI Search", desc: "对 Google 自有数据存储中摄取的数据执行搜索。" },
  "firestore": { title: "Google Cloud Firestore", desc: "使用自然语言与 Firestore 数据库中存储的文档进行交互。" },
  "logging": { title: "Google Cloud Logging", desc: "使用自然语言访问 Cloud Logging 平台中的资源。" },
  "kafka": { title: "Google Managed Service for Apache Kafka", desc: "使用自然语言管理 Managed Service for Apache Kafka 和 Kafka Connect 的集群。" },
  "monitoring": { title: "Google Cloud Monitoring", desc: "使用自然语言访问 Cloud Monitoring 平台中的资源。" }
};

// 编译出一个完美的 JavaScript 字符串放入 "new" 里面。
// 这里我们需要在 runtime 进行如下映射处理：
const translationLogic = `Oki=({mcpTemplates:e,installedMcpIds:t,installingMcpId:r,onInstall:n})=>{
  if(!e||e.length===0)return null;
  const mcpDict = ${JSON.stringify(mcpDict)};
  const sortedKeys = Object.keys(mcpDict).sort((x, y) => y.length - x.length);
  const e_zh = e.map(a => {
    let title = a.title;
    let desc = a.description;
    const aid = a.id ? a.id.toLowerCase() : "";
    const atitle = a.title ? a.title.toLowerCase() : "";
    let matched = null;
    for (let i = 0; i < sortedKeys.length; i++) {
      const key = sortedKeys[i];
      if (aid.indexOf(key) !== -1 || atitle.indexOf(key) !== -1) {
        matched = mcpDict[key];
        break;
      }
    }
    if (matched) {
      title = matched.title;
      desc = matched.desc;
    }
    return { ...a, title, description: desc };
  });
  return p("div", {
    className: "border border-border rounded divide-y divide-border",
    children: e_zh.map(a => {
      let i = t.has(a.id);
      return p("div", {
        className: "p-4 flex items-start justify-between gap-4",
        children: [
          p("div", {
            className: "flex-1 min-w-0",
            children: [
              p("div", {
                className: "flex items-center",
                children: a.link ? p("a", {
                  href: Wki(a.link),
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "group text-sm font-medium truncate hover:underline inline-flex items-center",
                  children: [
                    a.title,
                    (a.trustLevel === "official" || a.trustLevel === "verified") && p("span", {
                      className: "text-xs text-muted-foreground ml-1",
                      children: "由 Google 提供"
                    }),
                    p(qe, {
                      name: "open_in_new",
                      className: "w-3 h-3 ml-1 hidden group-hover:inline opacity-60"
                    })
                  ]
                }) : p("span", {
                  className: "text-sm font-medium truncate inline-flex items-center",
                  children: [
                    a.title,
                    (a.trustLevel === "official" || a.trustLevel === "verified") && p("span", {
                      className: "text-xs text-muted-foreground ml-1",
                      children: "由 Google 提供"
                    })
                  ]
                })
              }),
              p("div", {
                className: "text-xs text-muted-foreground mt-1 line-clamp-2",
                children: a.description
              })
            ]
          }),
          p("div", {
            className: "flex-shrink-0",
            children: i ? p("button", {
              className: "flex items-center gap-1 px-2 py-1 text-xs border border-current rounded disabled:opacity-50 text-muted-foreground cursor-not-allowed",
              disabled: !0,
              children: "已安装"
            }) : r === a.id ? p("button", {
              className: "flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/50 text-white rounded cursor-not-allowed",
              disabled: !0,
              children: [
                p(qe, { name: "progress_activity", className: "w-3 h-3 animate-spin" }),
                "正在安装..."
              ]
            }) : p("button", {
              className: "flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              onClick: () => { n?.(a.id); },
              disabled: r != null,
              children: [
                p(qe, { name: "add", className: "w-3 h-3" }),
                "添加"
              ]
            })
          })
        ]
      }, a.id);
    })
  });
}`.replace(/\s+/g, ' '); // 压缩空白字符，确保最终替换代码在一行中，因为 output 中 original 是一行，我们把它弄成一行可以防止其他潜在问题，并且符合 L10n 的格式

const jsonContent = fs.readFileSync(filePath, 'utf8');
const parsed = JSON.parse(jsonContent);

let replaced = false;
for (let i = 0; i < parsed.length; i++) {
  if (parsed[i].old.startsWith('Oki=')) {
    parsed[i].new = translationLogic;
    replaced = true;
    console.log('Found and updated Oki translation entry.');
    break;
  }
}

if (!replaced) {
  console.error('Could not find Oki translation entry in translations.json!');
  process.exit(1);
}

fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
console.log('Successfully wrote updated translations.json!');
