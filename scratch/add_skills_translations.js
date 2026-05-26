import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'translations.json');

const skillDict = {
  "alphafold-database-fetch-and-analyze": {
    name: "AlphaFold 数据库获取与分析",
    description: "获取并分析蛋白质的 AlphaFold 预测结构。当用户提供特定的 UniProt Accession ID 并希望获取结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用 —— 先询问 UniProt ID。"
  },
  "alphagenome-single-variant-analysis": {
    name: "AlphaGenome 单变体分析",
    description: "使用 AlphaGenome API 分析遗传变体对基因表达 (RNA-seq)、染色质可及性 (DNASE)、组蛋白标记 (ChIP) 和转录因子的影响。当用户询问启动子和增强子中的非编码变体效应、致病性、临床意义、疾病关联、功能效应、基因表达改变、剪接破坏或调控效应时使用。也用于将生物学术语解析为组织/细胞类型本体 (UBERON/CL) 或分析 chr:pos:ref>alt 格式的变体。"
  },
  "android-cli": {
    name: "Android 命令行工具",
    description: "使用 android 命令行工具编排 Android 开发任务，包括项目创建、部署、SDK 管理和环境诊断。"
  },
  "chembl-database": {
    name: "ChEMBL 数据库查询",
    description: "查询 ChEMBL 数据库以获取生物活性分子、药物靶点、生物活性数据、已批准药物和化学结构。当用户询问化合物、靶点、IC50/Ki 值、药物机制或进行结构搜索时使用。"
  },
  "clinical-trials-database": {
    name: "临床试验数据库查询",
    description: "通过 APIv2 查询 ClinicalTrials.gov。当您需要按疾病、药物、地点、状态或阶段搜索试验；通过 NCT ID 检索试验详情；检查入排标准；统计不同疾病或时间段的试验数量；确定赞助商的试验组合；为患者匹配寻找招募中的试验时使用。"
  },
  "clinvar-database": {
    name: "ClinVar 数据库查询",
    description: "在需要临床意义、致病性分类（例如致病性、良性、VUS）、临床证据原理或寻找人类基因组变体的“硬阳性”基准对照时使用。"
  },
  "dbsnp-database": {
    name: "dbSNP 数据库查询",
    description: "当您需要在 NCBI 的 dbSNP 数据库中查找、映射和搜索短遗传变体（SNP、插入缺失）时使用。在 rsID、VCF 格式的基因组坐标 and HGVS 字符串之间进行解析。对于 rsID，返回变体类型、基因关联、临床意义、等位基因频率和基因组坐标 (GRCh38)。"
  },
  "embl-ebi-ols": {
    name: "EMBL-EBI 本体查找服务",
    description: "查询和搜索 EMBL-EBI 本体查找服务 (OLS)，以获取 250 多个本体（例如 GO、DOID、HP）中的生物医学本体术语、定义和层级结构。当用户要求搜索术语、检索详情、导航层级（父级、子级、祖先）、查找属性和个体、获取自动完成建议或访问本体元数据和统计信息时使用。"
  },
  "encode-ccres-database": {
    name: "ENCODE 顺式调控元素查询",
    description: "通过 SCREEN GraphQL API 查询 ENCODE 顺式调控元素 (cCRE) 注册表，或向 ENCODE Portal REST API 发送自定义查询以获取实验和文件（ChIP-seq 峰值等）。当您需要查询人类细胞类型中的调控注释或原始实验数据时使用。"
  },
  "ensembl-database": {
    name: "Ensembl 数据库查询",
    description: "查询 Ensembl 数据库以解析基因、转录本和蛋白质 ID，获取基因组或蛋白质序列，检索基因结构（外显子），并获得变体后果和效应预测 (VEP)。将此技能作为主要的 ID 翻译器、基因组序列数据库和变体效应预测工具。"
  },
  "foldseek-structural-search": {
    name: "Foldseek 结构搜索",
    description: "使用 Foldseek API 对各种数据库（PDB、AlphaFold、CATH、MGnify 等）进行蛋白质 3D 结构搜索。仅当用户提供物理 3D 坐标文件（.cif、.mmcif 或 .pdb）并希望寻找结构相似的蛋白质时使用。如果用户仅提供蛋白质序列、基因名称或 UniProt ID，请勿使用。"
  },
  "gnomad-database": {
    name: "gnomAD 数据库查询",
    description: "查询基因组聚合数据库 (gnomAD)。在确定特定遗传变体的罕见性或等位基因频率、检索基因约束指标 (pLI、LOEUF) 以评估对丧失功能突变的耐受性、寻找基因组区域或基因中的变体或查询结构变体时使用。请勿用于分析单个患者基因组、追踪癌症体细胞突变（使用 COSMIC）或请求原始测序读段（使用 ENA）。"
  },
  "gtex-database": {
    name: "GTEx 数据库查询",
    description: "当您需要从 GTEx（基因型-组织表达）项目中获取 54 个非疾病组织部位的定量 RNA 表达数据和变体 eQTL 信息时使用。"
  },
  "human-protein-atlas-database": {
    name: "人类蛋白质图谱查询",
    description: "当您需要从人类蛋白质图谱 (HPA) 检索半定量的蛋白质表达和空间定位数据时使用。"
  },
  "interpro-database": {
    name: "InterPro 数据库查询",
    description: "识别蛋白质中的结构域、家族和位点；寻找属于同一家族或共享结构域的所有蛋白质；探索结构域的物种分布；使用蛋白质家族和 GO 术语注释基因组。InterPro 将 14 个数据库（例如 Pfam、CDD）整合为一个可搜索的资源。InterPro-N 通过深度学习显著扩展了注释和序列覆盖范围。包括结构域架构 (IDA) 搜索。"
  },
  "jaspar-database": {
    name: "JASPAR 数据库查询",
    description: "查询 JASPAR 数据库以获取转录因子 (TF) 结合图谱。当检索特定 TF 的位置频率矩阵 (PFM) 或位置权重矩阵 (PWM)、将基因符号解析为 JASPAR 矩阵 ID 或获取 TF 元数据时使用。支持多种输出格式 (MEME、TRANSFAC、PFM、JASPAR、YAML)。"
  },
  "literature-search-arxiv": {
    name: "arXiv 文献搜索",
    description: "在 arXiv 上搜索科学论文、预印本和出版物。提取元数据、摘要并下载论文的全文 PDF 或 HTML 版本。当用户要求寻找研究论文、文献或特定的 arXiv ID 时使用。"
  },
  "literature-search-biorxiv": {
    name: "bioRxiv 文献搜索",
    description: "浏览、筛选并下载来自 bioRxiv 和 medRxiv 的生命科学、生物学和医学预印本。支持通过 DOI 获取论文元数据，以及通过类别和关键字筛选浏览日期范围。关键字筛选是在本地进行的，因此日期范围必须狭窄（1-4 周）并指定类别以防止超时。"
  },
  "literature-search-europepmc": {
    name: "Europe PMC 文献搜索",
    description: "在 Europe PMC 中搜索科学文献并下载开放获取的全文和 PDF。通过 PMCID 检索全文 XML/纯文本，获取引用列表和文献目录。"
  },
  "literature-search-openalex": {
    name: "OpenAlex 学术搜索",
    description: "查询 OpenAlex 学术数据库以获取研究论文、作者、机构、主题、来源、出版商、资助者、地理位置和关键字。在搜索学术论文、解析 DOI、下载开放获取 PDF、寻找作者的出版物、汇总文献计量数据（引用次数、h 指数、影响因子）、探索研究分类法或执行 DOI 查找时使用。"
  },
  "ncbi-sequence-fetch": {
    name: "NCBI 序列获取",
    description: "使用 E-utilities 从 NCBI 数据库检索蛋白质和核苷酸序列。支持直接登录号查找、CDS 翻译、基因+生物体搜索、基因座查找、PubMed 链接序列、专利蛋白质提取以及生物体+长度回退搜索。当您需要通过登录号、基因名称、基因座标签、PubMed ID 或专利号获取生物序列时使用。"
  },
  "openfda-database": {
    name: "openFDA 数据库查询",
    description: "查询、搜索并下载 openFDA API 中关于药物、器械、食品、烟草、化妆品、动植物及兽医产品、物质和透明度的数据。用于在所有 28 个 API 端点中查询 FDA 不良事件、召回、标签、批准、短缺、510(k) 许可、NDC 查找以及任何 FDA 安全或监管数据。"
  },
  "opentargets-database": {
    name: "Open Targets 靶点发现",
    description: "查询 Open Targets 平台以获取靶点与疾病关联、药物靶点发现、可成药性/安全性数据、遗传学/组学证据、已知药物，用于治疗靶点识别。"
  },
  "pdb-database": {
    name: "PDB 结构查询",
    description: "当您想要搜索或下载生物大分子（蛋白质、核酸、结合配体）的实验确定 3D 结构时使用。支持通过序列相似性、结构相似性、化学和其他属性进行搜索。也用于获取有关生物分子结构实验的元数据。"
  },
  "protein-sequence-msa": {
    name: "蛋白质多序列比对",
    description: "使用 EBI Clustal Omega 执行蛋白质的多序列比对。当您需要比对多个序列以评估相似性、结构域保守性或关键残基保守性时使用。支持多达 4000 条序列，最大文件大小为 4 MB。请勿用于在数据库中搜索同源蛋白质（使用 MMseqs2、BLAST）、比对非蛋白质序列（DNA、RNA）、执行结构比对（使用 Foldseek、PyMOL）或仅有单条序列的情况。"
  },
  "protein-sequence-similarity-search": {
    name: "蛋白质序列相似性搜索",
    description: "使用 MMseqs2（快速，默认）或 BLAST（全面，回退）搜索同源蛋白质序列。每当用户提供蛋白质序列或 FASTA 文件并要求寻找同源物、序列匹配或希望根据序列相似性推断蛋白质功能时触发，但当用户希望根据结构相似性推断蛋白质功能时请勿使用。"
  },
  "pubchem-database": {
    name: "PubChem 数据库查询",
    description: "查询 PubChem，通过名称/CID/SMILES 搜索，检索属性，进行相似性/子结构搜索、生物活性查询，用于化学信息学。当用户询问特定的化学物质、药物或分子时使用。"
  },
  "pubmed-database": {
    name: "PubMed 文献搜索",
    description: "在 PubMed 中搜索科学文献，包括已发表的临床试验。获取摘要和全文。将已发表的研究与生物学数据库（基因、蛋白质、核苷酸、PubChem）相链接，以发现论文与特定化合物或基因之间的关联。验证医学拼写，匹配原始引用，并缓存结果集以进行批量处理。接口包含 NCBI E-utilities 和 PMC BioC API。"
  },
  "pymol": {
    name: "PyMOL 分子可视化",
    description: "使用 PyMOL 可视化、分析和渲染蛋白质及分子结构。当用户想要创建蛋白质结构图像、执行结构比对或叠加、测量距离或接触、突出显示结合位点或活性位点残基、按 B 因子/pLDDT 着色或分析蛋白质-配体相互作用时使用。请勿用于对接、分子动力学或纯序列分析。"
  },
  "quickgo-database": {
    name: "QuickGO 基因本体查询",
    description: "查询 QuickGO 和证据与结论本体 (ECO) REST API。当您需要将基因映射到生物学过程、分子功能或细胞成分，寻找与特定通路/GO 术语相关的基因，或探索基因本体层级结构时使用。请勿用于查询药物靶点（使用 OpenTargets）或机械性信号传导通路图（使用 KEGG）。"
  },
  "reactome-database": {
    name: "Reactome 通路数据库查询",
    description: "查询 Reactome 数据库（分析和内容服务）。当用户询问通路分析、基因列表富集、通过 token 检索结果、寻找未映射或未找到的标识符、映射标识符、反应参与者（输入、输出）、通路层级（包括顶级通路）、图表导出、交叉引用映射或搜索知识库时使用。"
  },
  "science-skills-common": {
    name: "科学技能通用库",
    description: "科学技能的共享 Python 包，当前包含 http_client —— 具有速率限制、重试和指数回退功能的统一 HTTP 客户端。不是独立的智能体技能。请勿直接调用。"
  },
  "string-database": {
    name: "STRING 相互作用数据库",
    description: "查询 STRING 数据库以获取蛋白质-蛋白质相互作用 (PPI)、功能富集和同源性。当用户询问特定蛋白质之间的相互作用、相互作用证据、置信度得分、蛋白质相互作用伙伴或通路富集时使用。"
  },
  "ucsc-conservation-and-tfbs": {
    name: "UCSC 保守性与转录因子结合位点",
    description: "从 UCSC 基因组浏览器获取进化保守性得分 (phyloP, phastCons) 和转录因子结合位点 (TFBS)。在分析基因组变体或区域是否在进化上保守、具有功能重要性或在主要项目（ENCODE、JASPAR、ReMap）中受到 TF 调控时使用。"
  },
  "unibind-database": {
    name: "UniBind 结合位点查询",
    description: "查询 UniBind 数据库以获取经实验验证的转录因子 (TF) 结合位点。当检索直接的 TF-DNA 相互作用数据集、下载用于本地分析的结合位点坐标 (BED/FASTA) 或按物种、细胞系或 TF 名称列出可用数据集时使用。请勿用于查询特定区间、位置、基因、母序模型或表达数据。"
  },
  "uniprot-database": {
    name: "UniProt 蛋白质数据库查询",
    description: "访问跨 UniProtKB、UniParc 和 UniRef 的蛋白质元数据、功能、分类和序列。在搜索蛋白质、映射标识符或检索功能注释和出版物时使用。请勿用于序列比对、蛋白质折叠或序列相似性搜索（针对这些任务使用专门的技能）。"
  },
  "uv": {
    name: "uv 包管理器",
    description: "检查是否安装了 uv Python 包管理器，如果缺失则进行安装。确保 uv 在 PATH 中。当其他技能需要 uv 作为先决条件时使用。"
  },
  "workflow-skill-creator": {
    name: "工作流技能构建器",
    description: "将完成的用户工作流或交互提炼为可重用的智能体技能。当用户要求将其工作流、交互或多步过程转化为技能，或者当他们说“将此制作成技能”、“根据我们刚刚所做的创建一个技能”、“打包此工作流”或类似内容时使用。请勿用于在没有现有工作流的情况下从头创建技能（对此使用通用的技能构建器）。"
  }
};

const okiOld = `var uRn=({item:e,onOpenFile:t,isLast:r,showBadge:n=!0})=>{let a=t&&e.canOpen;return p(nFe,{name:e.name,path:e.path,description:e.description,badge:p("div",{className:"flex gap-1 items-center",children:[(n||e.isGlobal)&&p(lRn,{isGlobal:e.isGlobal,workspaceName:e.workspaceName}),e.pluginName&&p(Zgt,{pluginName:e.pluginName})]}),isLast:r,onEdit:a?()=>t(e.path):void 0,editTitle:\`Edit \${e.name}\`})}`;

const okiNew = `var uRn=({item:e,onOpenFile:t,isLast:r,showBadge:n=!0})=>{
  let a=t&&e.canOpen;
  const skillDict = ${JSON.stringify(skillDict)};
  let name = e.name;
  let description = e.description;
  const key = e.name ? e.name.toLowerCase() : "";
  if (skillDict[key]) {
    name = skillDict[key].name;
    description = skillDict[key].description;
  }
  return p(nFe,{
    name: name,
    path: e.path,
    description: description,
    badge: p("div",{
      className: "flex gap-1 items-center",
      children: [
        (n||e.isGlobal)&&p(lRn,{isGlobal:e.isGlobal,workspaceName:e.workspaceName}),
        e.pluginName&&p(Zgt,{pluginName:e.pluginName})
      ]
    }),
    isLast: r,
    onEdit: a?()=>t(e.path):void 0,
    editTitle: \`编辑 \${name}\`,
    _dummy: \`\${e.name}\`
  });
}`.replace(/\s+/g, ' ');

const lrnOld = "lRn=({isGlobal:e,workspaceName:t})=>{let{projectManagementFeature:r}=pn();return p(\"span\",{className:`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${e?\"bg-blue-500/10 text-blue-400\":\"bg-green-500/10 text-green-400\"}`,children:e?\"Global\":r&&t?t.length>15?t.substring(0,15)+\"\\u2026\":t:\"Workspace\"})}";

const lrnNew = "lRn=({isGlobal:e,workspaceName:t})=>{let{projectManagementFeature:r}=pn();return p(\"span\",{className:`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${e?\"bg-blue-500/10 text-blue-400\":\"bg-green-500/10 text-green-400\"}`,children:e?\"全局\":r&&t?t.length>15?t.substring(0,15)+\"\\u2026\":t:\"工作区\"})}";

const jsonContent = fs.readFileSync(filePath, 'utf8');
const parsed = JSON.parse(jsonContent);

// 先检查是否已经存在 uRn 或 lRn，如果存在，先覆盖，否则追加
let uRnReplaced = false;
let lRnReplaced = false;

for (let i = 0; i < parsed.length; i++) {
  if (parsed[i].old.includes('uRn=({item:e,onOpenFile:t')) {
    parsed[i].old = okiOld;
    parsed[i].new = okiNew;
    uRnReplaced = true;
  }
  if (parsed[i].old.includes('lRn=({isGlobal:e')) {
    parsed[i].old = lrnOld;
    parsed[i].new = lrnNew;
    lRnReplaced = true;
  }
}

if (!uRnReplaced) {
  parsed.push({
    old: okiOld,
    new: okiNew
  });
  console.log('Appended uRn translation entry.');
} else {
  console.log('Updated existing uRn translation entry.');
}

if (!lRnReplaced) {
  parsed.push({
    old: lrnOld,
    new: lrnNew
  });
  console.log('Appended lRn translation entry.');
} else {
  console.log('Updated existing lRn translation entry.');
}

fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
console.log('Successfully wrote updated translations.json!');
