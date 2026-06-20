import fs from 'fs';

const filePath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');

if (entry) {
  let content = entry.new;
  const match = content.match(/const dictionary = (\{.*?\});/);
  if (match) {
    const dictStr = match[1];
    // Parse the existing dictionary
    const dict = new Function(`return ${dictStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\')}`)();
    
    // Define new translations to add
    const newTranslations = {
      "Confirm Undo": "确认撤销",
      "Confirming this undo action will make the following changes:": "确认此撤销操作将带来以下更改：",
      "Confirm": "确认",
      "Cancel step": "取消步骤",
      "Agent Security Settings": "智能体安全设置",
      "Set Project Name": "设置项目名称",
      "Project Name": "项目名称",
      "Create": "创建",
      "Create a new project. You canadd folders to it now or later.": "创建新项目。您现在或稍后可以向其中添加文件夹。",
      "Create a new project. You can add folders to it now or later.": "创建新项目。您现在或稍后可以向其中添加文件夹。",
      "Select branch": "选择分支",
      "Select Branch": "选择分支",
      "Default Branch": "默认分支",
      "default branch": "默认分支",
      "Next": "下一步",
      "Create project with existingfolder(s).": "使用现有文件夹创建项目。",
      "Create project with existing folder(s).": "使用现有文件夹创建项目。",
      "Instantly create a new projectand folder to start building.": "立即创建新项目和文件夹以开始构建。",
      "Instantly create a new project and folder to start building.": "立即创建新项目和文件夹以开始构建。",
      "New standalone conversation,outside of projects.": "新建独立对话，不属于任何项目。",
      "New standalone conversation, outside of projects.": "新建独立对话，不属于任何项目。",
      "Commands": "命\u2060令",
      "Command": "命\u2060令",
      "Files": "文\u2060件",
      "File": "文\u2060件",
      "file": "文\u2060件",
      "Convos": "对\u2060话",
      "Convo": "对\u2060话",
      "Conversations": "对\u2060话",
      "conversations": "对\u2060话",
      "Projects": "项\u2060目",
      "Project": "项\u2060目",
      "projects": "项\u2060目",
      "Open Diff": "打开对比",
      "Working directory": "工作目录",
      "Command execution finished": "命令执行完成",
      "Stop Task": "停止任务",
      "Media": "媒体",
      "Thinking": "正在思考",
      "Thinking...": "正在思考...",
      "Other Conversations": "其他对话",
      "Recent in": "最近在",
      "Current": "当前",
      "Recent Files": "最近文件",
      "Pending messages": "待处理消息",
      "Messages can be sent while theagent is still working. Yourmessage will be queued andinserted at the next availablebreak in reasoning.": "可以在智能体仍在工作时发送消息。您的消息将被排队，并在下一次推理中断时插入。",
      "No items found": "未找到任何项",
      "Recent": "最近",
      "Your quota for this model is running low.": "您对此模型的配额即将用尽。",
      
      // Skill descriptions: split suffixes (leading space removed from keys)
      "for a protein. Use when the user provides a specific UniProt Accession ID and wants structural confidence metrics (pLDDT), domain boundary analysis, or disorder assessment. Do not use if the user only has a protein name, gene name, or amino acid sequence — ask for a UniProt ID first.": "，用于蛋白质。当用户提供特定的 UniProt 访问 ID 并需要结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用——请先询问 UniProt ID。",
      "on gene expression (RNA-seq), chromatin accessibility (DNASE), histone marks (ChIP), and transcription factors using the AlphaGenome API. Use when the user asks about non-coding variant effects, pathogenicity, clinical significance, disease associations, functional effects, gene expression changes, splicing disruption, or regulatory effects in promoters and enhancers. Also use for resolving biological terms to tissue/cell-type ontologies (UBERON/CL) or analyzing variants in chr:pos:ref>alt format.": "对基因表达 (RNA-seq)、染色质可及性 (DNASE)、组蛋白标记 (ChIP) 和转录因子的影响。当用户询问非编码变异效应、致病性、临床意义、疾病关联、功能效应、基因表达变化、剪接破坏或启动子和增强子中的调控效应时使用。也用于将生物学术语解析为组织/细胞类型本体 (UBERON/CL) 或以 chr:pos:ref>alt 格式分析变异。",
      "including project creation, deployment, SDK management, and environment diagnostics using the android command-line tool.": "，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。",
      "for bioactive molecules, drug targets, bioactivity data, approved drugs, and chemical structures. Use when the user asks about compounds, targets, IC50/Ki values, drug mechanisms, or structure searches.": "以获取生物活性分子、药物靶点、生物活性数据、批准药物和化学结构。当用户询问化合物、靶点、IC50/Ki 值、药物机制或结构搜索时使用。",
      "Use when you want to search for trials by condition, drug, location, status, or phase; retrieve trial details by NCT ID; check eligibility/inclusion criteria; count trials across conditions or time periods; identify a sponsor's trial portfolio; find recruiting trials for patient matching.": "当您想根据疾病、药物、地点、状态或阶段搜索临床试验时使用；通过 NCT ID 获取试验详情；检查符合性/入组标准；统计不同疾病或时间段的试验数量；确定赞助商的试验组合；寻找招募中的试验以进行患者匹配。",
      "Resolves between rsIDs, genomic coordinates in VCF format, and HGVS strings. For an rsID, returns variant type, gene associations, clinical significance, allele frequencies, and genomic coordinates (GRCh38).": "在 rsID、VCF 格式的基因组坐标和 HGVS 字符串之间进行解析。对于 rsID，返回变异类型、基因关联、临床意义、等位基因频率和基因组坐标 (GRCh38)。",
      "Use when the user asks to search for terms, retrieve details, navigate hierarchies (parents, children, ancestors), look up properties and individuals, get autocomplete suggestions, or access ontology metadata and statistics.": "当用户要求搜索术语、获取详细信息、导航层级（父项、子项、祖先项）、查找属性和个体、获取自动补全建议，或访问本体元数据和统计信息时使用。",
      "Use when you want to query regulatory annotations or raw experimental data across human cell types.": "当您想查询人类细胞类型的调控注释或原始实验数据时使用。",
      "Use this skill as a primary ID translator, genomic sequence database and variant effect prediction tool.": "将此技能用作主要的 ID 转换器、基因组序列数据库和变异效应预测工具。",
      "Use ONLY when the user provides a physical 3D coordinate file (.cif, .mmcif, or .pdb) and wants to find structurally similar proteins. Do NOT use if the user only provides a protein sequence, gene name, or UniProt ID.": "仅当用户提供物理 3D 坐标文件（.cif、.mmcif 或 .pdb）并希望寻找结构相似的蛋白质时使用。如果用户仅提供蛋白质序列、基因名称或 UniProt ID，请勿使用。",
      "Use when determining the rarity or allele frequency of specific genetic variants, retrieving gene constraint metrics (pLI, LOEUF) to assess loss-of-function intolerance, finding variants in a genomic region or gene, or querying structural variants. Don't use for analyzing individual patient genomes, tracking somatic mutations in cancer (use COSMIC), or requesting raw sequencing reads (use ENA).": "在确定特定遗传变异的稀有性或等位基因频率、检索基因约束指标 (pLI, LOEUF) 以评估丧失功能耐受性、寻找基因组区域或基因中的变异，或查询结构变异时使用。不要用于分析单个患者基因组、追踪癌症体细胞突变（使用 COSMIC）或请求原始测序读取（使用 ENA）。",
      "InterPro combines 14 databases (e.g., Pfam, CDD) into one searchable resource. InterPro-N significantly expands annotation and sequence coverage with deep learning. Includes domain architecture (IDA) search.": "InterPro 将 14 个数据库（例如 Pfam, CDD）整合为一个可搜索的资源。InterPro-N 通过深度学习显著扩展了注释和序列覆盖面。包含域架构 (IDA) 搜索。",
      "Use when retrieving Position Frequency Matrices (PFMs) or Position Weight Matrices (PWMs) for specific TFs, resolving gene symbols to JASPAR Matrix IDs, or getting TF metadata. Supports multiple output formats (MEME, TRANSFAC, PFM, JASPAR, YAML).": "当检索特定 TF 的位置频率矩阵 (PFM) 或位置权重矩阵 (PWM)、将基因符号解析为 JASPAR 矩阵 ID 或获取 TF 元数据时使用。支持多种输出格式（MEME、TRANSFAC、PFM、JASPAR、YAML）。",
      "Extract metadata, abstracts, and download full-text PDFs or HTML versions of papers. Use when the user asks to find research papers, literature, or specific arXiv IDs.": "提取元数据、摘要，并下载论文的全文 PDF 或 HTML 版本。当用户要求寻找研究论文、文献或特定 arXiv ID 时使用。",
      "Supports fetching paper metadata by DOI, and browsing by date range with category and keyword filters. Keyword filtering is local, so date ranges MUST be narrow (1-4 weeks) with a category to prevent timeouts.": "支持通过 DOI 获取论文元数据，并支持通过带有类别和关键字筛选的日期范围进行浏览。关键字筛选是本地的，因此日期范围必须狭窄（1-4 周）并指定类别以防止超时。",
      "Retrieve full-text XML/plain text by PMCID, get citation lists and bibliography.": "通过 PMCID 获取全文 XML/纯文本，获取引用列表和文献目录。",
      "Use when searching academic papers, resolving DOIs, downloading open-access PDFs, finding an author's publications, aggregating bibliometric data (citation counts, h-index, impact factor), exploring the research taxonomies, or performing DOI lookups.": "当搜索学术论文、解析 DOI、下载开放获取 PDF、寻找作者的出版物、汇总文献计量数据（引用次数、h 指数、影响因子）、探索研究分类法或进行 DOI 查找时使用。",
      "Supports direct accession lookup, CDS translation, gene+organism search, locus lookup, PubMed-linked sequences, patent protein extraction, and organism+length fallback search. Use when you need to fetch biological sequences by accession, gene name, locus tag, PubMed ID, or patent number.": "支持直接访问号查找、CDS 翻译、基因+生物体搜索、基因座查找、PubMed 链接的序列、专利蛋白质提取以及生物体+长度回退搜索。当您需要通过访问号、基因名称、基因座标签、PubMed ID 或专利号获取生物序列时使用。",
      "Use for FDA adverse events, recalls, labeling, approvals, shortages, 510(k) clearances, NDC lookups, and any FDA safety or regulatory data query across all 28 API endpoints.": "用于在所有 28 个 API 端点上进行 FDA 不良事件、召回、标签、批准、短缺、510(k) 许可、NDC 查找以及任何 FDA 安全或监管数据查询。",
      "Supports searching by sequence similarity, structure similarity, chemical and other attributes. Also use to get metadata about biomolecular structure experiments.": "支持通过序列相似性、结构相似性、化学和其他属性进行搜索。也用于获取关于生物大分子结构实验的元数据。",
      "Use when you need to align multiple sequences to assess similarity, domain conservation, or key residue conservation. Supports up to 4000 sequences and a maximum file size of 4 MB. Do not use to search for homologous proteins in a database (use MMseqs2, BLAST), align non-protein sequences (DNA, RNA), perform structural alignment (use Foldseek, PyMOL), or if you only have a single sequence.": "当您需要比对多个序列以评估相似性、结构域保守性或关键残基保守性时使用。支持最多 4000 个序列，最大文件大小为 4 MB。不要用于在数据库中搜索同源蛋白质（使用 MMseqs2、BLAST）、比对非蛋白质序列（DNA、RNA）、进行结构比对（使用 Foldseek、PyMOL），或在您只有单个序列时使用。",
      "Use when a user asks about a specific chemical, drug, or molecule.": "当用户询问特定化学品、药物或分子时使用。",
      "Fetch abstracts and full text. Link published research to biological databases (gene, protein, nucleotide, PubChem) to discover associations between papers and specific compounds or genes. Verify medical spelling, match raw citations, and cache result sets for bulk processing. Interfaces NCBI E-utilities and PMC BioC APIs.": "获取摘要和全文。将已发表的研究链接到生物数据库（基因、蛋白质、核苷酸、PubChem），以发现论文与特定化合物或基因之间的关联。验证医学拼写，匹配原始引用，并缓存结果集以进行批量处理。接口连接 NCBI E-utilities 和 PMC BioC API。",
      "Use when the user wants to create images of protein structures, perform structural alignments or superposition, measure distances or contacts, highlight binding sites or active site residues, color by B-factor/pLDDT, or analyze protein-ligand interactions. Do not use for docking, molecular dynamics, or sequence-only analysis.": "当用户希望创建蛋白质结构图像、进行结构比对或叠加、测量距离或接触、突出显示结合位点或活性位点残基、按 B 因子/pLDDT 着色，或分析蛋白质-配体相互作用时使用。不要用于对接、分子动力学或纯序列分析。",
      "Use this when you need to map genes to biological processes, molecular functions, or cellular components, find genes associated with a specific pathway/GO term, or explore the Gene Ontology hierarchy. Do not use for querying drug targets (use OpenTargets) or mechanistic signaling pathway diagrams (use KEGG).": "当您需要将基因映射到生物学过程、分子功能或细胞成分，寻找与特定通路/GO 术语关联的基因，或探索基因本体层级时使用。不要用于查询药物靶点（使用 OpenTargets）或机械性信号传导通路图（使用 KEGG）。",
      "Use when the user asks about pathway analysis, gene list enrichment, retrieving results by token, finding unmapped or not-found identifiers, mapping identifiers, reaction participants (inputs, outputs), pathway hierarchy (including top-level pathways), diagram export, cross-reference mapping, or searching the knowledgebase.": "当用户询问通路分析、基因列表富集、通过 Token 获取结果、寻找未映射或未找到的标识符、映射标识符、反应参与者（输入、输出）、通路层级（包括顶级通路）、图表导出、交叉引用映射或搜索知识库时使用。",
      "Use when the user asks about interactions between specific proteins, interaction evidence, confidence scores, protein interaction partners, or pathway enrichments.": "当用户询问特定蛋白质之间的相互作用、相互作用证据、置信度得分、蛋白质相互作用伙伴或通路富集时使用。",
      "Use when analyzing whether genomic variants or regions are evolutionarily conserved, functionally important, or bounded by TF regulators across major projects (ENCODE, JASPAR, ReMap).": "在分析主要项目（ENCODE、JASPAR、ReMap）的基因组变异或区域是否具有进化保守性、功能重要性，或是否受到 TF 调控因子约束时使用。",
      "Use when retrieving direct TF-DNA interaction datasets, downloading binding site coordinates (BED/FASTA) for local analysis, or listing available datasets by species, cell line, or TF name. Don't use to query specific intervals, locations, genes, motif models or expression data.": "当检索直接的 TF-DNA 相互作用数据集、下载结合位点坐标（BED/FASTA）进行本地分析，或按物种、细胞系或 TF 名称列出可用数据集时使用。不要用于查询特定的区间、位置、基因、基序模型或表达数据。",
      "Use when searching for proteins, mapping identifiers, or retrieving functional annotations and publications. Don't use for sequence alignment, protein folding, or sequence similarity search (use specialized skills for those tasks).": "在搜索蛋白质、映射标识符，或检索功能注释和出版物时使用。不要用于序列比对、蛋白质折叠或序列相似性搜索（针对这些任务请使用专用技能）。",
      "Ensures uv is on PATH. Use when another skill requires uv as a prerequisite.": "确保 uv 位于 PATH 中。当其他技能需要 uv 作为先决条件时使用。",

      // Skill descriptions: full sentences
      "Retrieve and analyze AlphaFold predicted structures for a protein. Use when the user provides a specific UniProt Accession ID and wants structural confidence metrics (pLDDT), domain boundary analysis, or disorder assessment. Do not use if the user only has a protein name, gene name, or amino acid sequence — ask for a UniProt ID first.": "检索并分析蛋白质的 AlphaFold 预测结构。当用户提供特定的 UniProt 访问 ID 并需要结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用——请先询问 UniProt ID。",
      "Analyzes genetic variant effects on gene expression (RNA-seq), chromatin accessibility (DNASE), histone marks (ChIP), and transcription factors using the AlphaGenome API. Use when the user asks about non-coding variant effects, pathogenicity, clinical significance, disease associations, functional effects, gene expression changes, splicing disruption, or regulatory effects in promoters and enhancers. Also use for resolving biological terms to tissue/cell-type ontologies (UBERON/CL) or analyzing variants in chr:pos:ref>alt format.": "使用 AlphaGenome API 分析遗传变异对基因表达 (RNA-seq)、染色质可及性 (DNASE)、组蛋白标记 (ChIP) 和转录因子的影响。当用户询问非编码变异效应、致病性、临床意义、疾病关联、功能效应、基因表达变化、剪接破坏或启动子和增强子中的调控效应时使用。也用于将生物学术语解析为组织/细胞类型本体 (UBERON/CL) 或以 chr:pos:ref>alt 格式分析变异。",
      "Orchestrates Android development tasks including project creation, deployment, SDK management, and environment diagnostics using the android command-line tool.": "使用 android 命令行工具编排 Android 开发任务，包括项目创建、部署、SDK 管理和环境诊断。",
      "Query the ChEMBL database for bioactive molecules, drug targets, bioactivity data, approved drugs, and chemical structures. Use when the user asks about compounds, targets, IC50/Ki values, drug mechanisms, or structure searches.": "在 ChEMBL 数据库中查询生物活性分子、药物靶点、生物活性数据、批准药物和化学结构。当用户询问化合物、靶点、IC50/Ki 值、药物机制或结构搜索时使用。",
      "Query ClinicalTrials.gov via APIv2. Use when you want to search for trials by condition, drug, location, status, or phase; retrieve trial details by NCT ID; check eligibility/inclusion criteria; count trials across conditions or time periods; identify a sponsor's trial portfolio; find recruiting trials for patient matching.": "通过 APIv2 查询 ClinicalTrials.gov。当您想根据疾病、药物、地点、状态或阶段搜索临床试验时使用；通过 NCT ID 获取试验详情；检查符合性/入组标准；统计不同疾病或时间段的试验数量；确定赞助商的试验组合；寻找招募中的试验以进行患者匹配。",
      "Use when you want to look up, map, and search for short genetic variants (SNPs, indels) in NCBI's dbSNP database. Resolves between rsIDs, genomic coordinates in VCF format, and HGVS strings. For an rsID, returns variant type, gene associations, clinical significance, allele frequencies, and genomic coordinates (GRCh38).": "当您想在 NCBI 的 dbSNP 数据库中查找、映射 and 搜索短遗传变异（SNP、插入缺失）时使用。在 rsID、VCF 格式的基因组坐标和 HGVS 字符串之间进行解析。对于 rsID，返回变异类型、基因关联、临床意义、等位基因频率和基因组坐标 (GRCh38)。",
      "Query and search the EMBL-EBI Ontology Lookup Service (OLS) for biomedical ontology terms, definitions, and hierarchies across 250+ ontologies (e.g., GO, DOID, HP). Use when the user asks to search for terms, retrieve details, navigate hierarchies (parents, children, ancestors), look up properties and individuals, get autocomplete suggestions, or access ontology metadata and statistics.": "在 EMBL-EBI 本体查找服务 (OLS) 中查询和搜索跨 250 多个本体（例如 GO、DOID、HP）的生物医学本体术语、定义和层级。当用户要求搜索术语、获取详细信息、导航层级（父项、子项、祖先项）、查找属性和个体、获取自动补全建议，或访问本体元数据和统计信息时使用。",
      "Query the ENCODE Registry of cis-Regulatory Elements (cCREs) via the SCREEN GraphQL API, or make custom queries to the ENCODE Portal REST API for experiments and files (ChIP-seq peaks, etc.). Use when you want to query regulatory annotations or raw experimental data across human cell types.": "通过 SCREEN GraphQL API 查询 ENCODE 顺式调控元件 (cCREs) 注册库，或对 ENCODE 门户 REST API 进行自定义查询以获取实验和文件（ChIP-seq 峰等）。当您想查询人类细胞类型的调控注释或原始实验数据时使用。",
      "Query the Ensembl database to resolve gene, transcript, and protein IDs, fetch genomic or protein sequences, retrieve gene structures (exons), and get variant consequence and effect predictions (VEP). Use this skill as a primary ID translator, genomic sequence database and variant effect prediction tool.": "查询 Ensembl 数据库以解析基因、转录本和蛋白质 ID，获取基因组或蛋白质序列，检索基因结构（外显子），并获取变异后果和效应预测 (VEP)。将此技能用作主要的 ID 转换器、基因组序列数据库和变异效应预测工具。",
      "Performs 3D structural searches of proteins against various databases (PDB, AlphaFold, CATH, MGnify, etc.) using the Foldseek API. Use ONLY when the user provides a physical 3D coordinate file (.cif, .mmcif, or .pdb) and wants to find structurally similar proteins. Do NOT use if the user only provides a protein sequence, gene name, or UniProt ID.": "使用 Foldseek API 在各种数据库（PDB、AlphaFold、CATH、MGnify 等）中对蛋白质进行 3D 结构搜索。仅当用户提供物理 3D 坐标文件（.cif、.mmcif 或 .pdb）并希望寻找结构相似的蛋白质时使用。如果用户仅提供蛋白质序列、基因名称或 UniProt ID，请勿使用。",
      "Query the Genome Aggregation Database (gnomAD). Use when determining the rarity or allele frequency of specific genetic variants, retrieving gene constraint metrics (pLI, LOEUF) to assess loss-of-function intolerance, finding variants in a genomic region or gene, or querying structural variants. Don't use for analyzing individual patient genomes, tracking somatic mutations in cancer (use COSMIC), or requesting raw sequencing reads (use ENA).": "查询基因组聚合数据库 (gnomAD)。在确定特定遗传变异的稀有性或等位基因频率、检索基因约束指标 (pLI, LOEUF) 以评估丧失功能耐受性、寻找基因组区域或基因中的变异，或查询结构变异时使用。不要用于分析单个患者基因组、追踪癌症体细胞突变（使用 COSMIC）或请求原始测序读取（使用 ENA）。",
      "Use when you want to retrieve quantitative RNA expression data and variant eQTL information from the GTEx (Genotype-Tissue Expression) Project across 54 non-diseased tissue sites.": "当您想从 GTEx（基因型-组织表达）项目获取跨 54 个非疾病组织位点的定量 RNA 表达数据和变异 eQTL 信息时使用。",
      "Use when you want to retrieve semi-quantitative protein expression and spatial localisation data from the Human Protein Atlas (HPA).": "当您想从人类蛋白质图谱 (HPA) 获取半定量蛋白质表达和空间定位数据时使用。",
      "Identify domains, families, and sites in proteins; find all proteins in a family or sharing a domain; explore species distribution for a domain; annotate genomes with protein families and GO terms. InterPro combines 14 databases (e.g., Pfam, CDD) into one searchable resource. InterPro-N significantly expands annotation and sequence coverage with deep learning. Includes domain architecture (IDA) search.": "识别蛋白质中的结构域、家族和位点；寻找家族中或共享结构域的所有蛋白质；探索结构域的物种分布；用蛋白质家族和 GO 术语注释基因组。InterPro 将 14 个数据库（例如 Pfam, CDD）整合为一个可搜索的资源。InterPro-N 通过深度学习显著扩展了注释和序列覆盖面。包含域架构 (IDA) 搜索。",
      "Query the JASPAR database for Transcription Factor (TF) binding profiles. Use when retrieving Position Frequency Matrices (PFMs) or Position Weight Matrices (PWMs) for specific TFs, resolving gene symbols to JASPAR Matrix IDs, or getting TF metadata. Supports multiple output formats (MEME, TRANSFAC, PFM, JASPAR, YAML).": "查询 JASPAR 数据库以获取转录因子 (TF) 结合图谱。当检索特定 TF 的位置频率矩阵 (PFM) 或位置权重矩阵 (PWM)、将基因符号解析为 JASPAR 矩阵 ID 或获取 TF 元数据时使用。支持多种输出格式（MEME、TRANSFAC、PFM、JASPAR、YAML）。",
      "Search for scientific papers, preprints, and publications on arXiv. Extract metadata, abstracts, and download full-text PDFs or HTML versions of papers. Use when the user asks to find research papers, literature, or specific arXiv IDs.": "在 arXiv 上搜索科学论文、预印本和出版物。提取元数据、摘要，并下载论文的全文 PDF 或 HTML 版本。当用户要求寻找研究论文、文献或特定 arXiv ID 时使用。",
      "Browse, filter, and download life sciences, biology, and medical preprints from bioRxiv and medRxiv. Supports fetching paper metadata by DOI, and browsing by date range with category and keyword filters. Keyword filtering is local, so date ranges MUST be narrow (1-4 weeks) with a category to prevent timeouts.": "浏览、筛选和下载 bioRxiv 和 medRxiv 中的生命科学、生物学和医学预印本。支持通过 DOI 获取论文元数据，并支持通过带有类别和关键字筛选的日期范围进行浏览。关键字筛选是本地的，因此日期范围必须狭窄（1-4 周）并指定类别以防止超时。",
      "Search Europe PMC for scientific literature and download open-access full texts and PDFs. Retrieve full-text XML/plain text by PMCID, get citation lists and bibliography.": "在欧洲 PMC 中搜索科学文献并下载开放获取的全文和 PDF。通过 PMCID 获取全文 XML/纯文本，获取引用列表和文献目录。",
      "Query the OpenAlex scholarly database for research papers, authors, institutions, topics, sources, publishers, funders, geo-locations, and keywords. Use when searching academic papers, resolving DOIs, downloading open-access PDFs, finding an author's publications, aggregating bibliometric data (citation counts, h-index, impact factor), exploring the research taxonomies, or performing DOI lookups.": "在 OpenAlex 学术数据库中查询研究论文、作者、机构、主题、来源、出版商、资资助者、地理位置和关键词。当搜索学术论文、解析 DOI、下载开放获取 PDF、寻找作者的出版物、汇总文献计量数据（引用次数、h 指数、影响因子）、探索研究分类法或进行 DOI 查找时使用。",
      "Retrieve protein and nucleotide sequences from NCBI databases using E-utilities. Supports direct accession lookup, CDS translation, gene+organism search, locus lookup, PubMed-linked sequences, patent protein extraction, and organism+length fallback search. Use when you need to fetch biological sequences by accession, gene name, locus tag, PubMed ID, or patent number.": "使用 E-utilities 从 NCBI 数据库检索蛋白质和核苷酸序列。支持直接访问号查找、CDS 翻译、基因+生物体搜索、基因座查找、PubMed 链接的序列、专利蛋白质提取以及生物体+长度回退搜索。当您需要通过访问号、基因名称、基因座标签、PubMed ID 或专利号获取生物序列时使用。",
      "Query, search, and download data from the openFDA API for drugs, devices, foods, tobacco, cosmetics, animal and veterinary products, substances, and transparency data. Use for FDA adverse events, recalls, labeling, approvals, shortages, 510(k) clearances, NDC lookups, and any FDA safety or regulatory data query across all 28 API endpoints.": "从 openFDA API 查询、搜索和下载药物、器械、食品、烟草、化妆品、动物和兽药产品、物质及透明度数据。用于在所有 28 个 API 端点上进行 FDA 不良事件、召回、标签、批准、短缺、510(k) 许可、NDC 查找以及任何 FDA 安全或监管数据查询。",
      "Query Open Targets Platform for target-disease associations, drug target discovery, tractability/safety data, genetics/omics evidence, known drugs, for therapeutic target identification.": "在 Open Targets 平台查询靶点-疾病关联、药物靶点发现、可成药性/安全性数据、遗传学/组学证据、已知药物，以进行治疗靶点识别。",
      "Use when you want to search for or download experimentally-determined 3D structures for biomolecules (proteins, nucleic acids, bound ligands). Supports searching by sequence similarity, structure similarity, chemical and other attributes. Also use to get metadata about biomolecular structure experiments.": "当您想搜索或下载生物大分子（蛋白质、核酸、结合配体）实验确定的 3D 结构时使用。支持通过序列相似性、结构相似性、化学和其他属性进行搜索。也用于获取关于生物大分子结构实验的元数据。",
      "Performs multiple sequence alignment of proteins with EBI Clustal Omega. Use when you need to align multiple sequences to assess similarity, domain conservation, or key residue conservation. Supports up to 4000 sequences and a maximum file size of 4 MB. Do not use to search for homologous proteins in a database (use MMseqs2, BLAST), align non-protein sequences (DNA, RNA), perform structural alignment (use Foldseek, PyMOL), or if you only have a single sequence.": "使用 EBI Clustal Omega 对蛋白质进行多序列比对。当您需要比对多个序列以评估相似性、结构域保守性或关键残基保守性时使用。支持最多 4000 个序列，最大文件大小为 4 MB。不要用于在数据库中搜索同源蛋白质（使用 MMseqs2、BLAST）、比对非蛋白质序列（DNA、RNA）、进行结构比对（使用 Foldseek、PyMOL），或在您只有单个序列时使用。",
      "Searches for homologous protein sequences using MMseqs2 (fast, default) or BLAST (comprehensive, fallback). Trigger this whenever the user provides a protein sequence or FASTA file and asks to find homologues, sequence matches, or wants to infer protein function based on sequence similarity, but not when the user wants to infer protein function based on structural similarity.": "使用 MMseqs2（快速，默认）或 BLAST（全面，回退）搜索同源蛋白质序列。每当用户提供蛋白质序列或 FASTA 文件并要求寻找同源物、序列匹配，或希望基于序列相似性推断蛋白质功能时触发此操作，但在用户希望基于结构相似性推断蛋白质功能时不触发。",
      "Query PubChem, search by name/CID/SMILES, retrieve properties, similarity/substructure searches, bioactivity, for cheminformatics. Use when a user asks about a specific chemical, drug, or molecule.": "查询 PubChem，通过名称/CID/SMILES 搜索，获取性质、相似性/子结构搜索、生物活性以进行化学信息学。当用户询问特定化学品、药物或分子时使用。",
      "Search PubMed for scientific literature, including published clinical trials. Fetch abstracts and full text. Link published research to biological databases (gene, protein, nucleotide, PubChem) to discover associations between papers and specific compounds or genes. Verify medical spelling, match raw citations, and cache result sets for bulk processing. Interfaces NCBI E-utilities and PMC BioC APIs.": "在 PubMed 中搜索科学文献，包括已发表的临床试验。获取摘要和全文。将已发表的研究链接到生物数据库（基因、蛋白质、核苷酸、PubChem），以发现论文与特定化合物或基因之间的关联。验证医学拼写，匹配原始引用，并缓存结果集以进行批量处理。接口连接 NCBI E-utilities 和 PMC BioC API。",
      "Visualize, analyze, and render protein and molecular structures using PyMOL. Use when the user wants to create images of protein structures, perform structural alignments or superposition, measure distances or contacts, highlight binding sites or active site residues, color by B-factor/pLDDT, or analyze protein-ligand interactions. Do not use for docking, molecular dynamics, or sequence-only analysis.": "使用 PyMOL 对蛋白质和分子结构进行可视化、分析和渲染。当用户希望创建蛋白质结构图像、进行结构比对或叠加、测量距离或接触、突出显示结合位点或活性位点残基、按 B 因子/pLDDT 着色，或分析蛋白质-配体相互作用时使用。不要用于对接、分子动力学或纯序列分析。",
      "Query the QuickGO and Evidence & Conclusion Ontology (ECO) REST API. Use this when you need to map genes to biological processes, molecular functions, or cellular components, find genes associated with a specific pathway/GO term, or explore the Gene Ontology hierarchy. Do not use for querying drug targets (use OpenTargets) or mechanistic signaling pathway diagrams (use KEGG).": "查询 QuickGO 和证据与结论本体 (ECO) REST API。当您需要将基因映射到生物学过程、分子功能或细胞成分，寻找与特定通路/GO 术语关联的基因，或探索基因本体层级时使用。不要用于查询药物靶点（使用 OpenTargets）或机械性信号传导通路图（使用 KEGG）。",
      "Query the Reactome database (Analysis and Content Services). Use when the user asks about pathway analysis, gene list enrichment, retrieving results by token, finding unmapped or not-found identifiers, mapping identifiers, reaction participants (inputs, outputs), pathway hierarchy (including top-level pathways), diagram export, cross-reference mapping, or searching the knowledgebase.": "查询 Reactome 数据库（分析和内容服务）。当用户询问通路分析、基因列表富集、通过 Token 获取结果、寻找未映射或未找到的标识符、映射标识符、反应参与者（输入、输出）、通路层级（包括顶级通路）、图表导出、交叉引用映射或搜索知识库时使用。",
      "Shared Python package for Science Skills, currently containing http_client -- a unified HTTP client with rate limiting, retries, and exponential backoff. Not a standalone agent skill. Do not invoke directly.": "科学技能的共享 Python 包，当前包含 http_client —— 具有速率限制、重试和指数退避的统一 HTTP 客户端。不是独立的智能体技能。请勿直接调用。",
      "Query the STRING database for protein-protein interactions (PPIs), functional enrichment, and homology. Use when the user asks about interactions between specific proteins, interaction evidence, confidence scores, protein interaction partners, or pathway enrichments.": "在 STRING 数据库中查询蛋白质-蛋白质相互作用 (PPI)、功能富集和同源性。当用户询问特定蛋白质之间的相互作用、相互作用证据、置信度得分、蛋白质相互作用伙伴或通路富集时使用。",
      "Fetch Evolutionary Conservation scores (phyloP, phastCons) and Transcription Factor Binding Sites (TFBS) from the UCSC Genome Browser. Use when analyzing whether genomic variants or regions are evolutionarily conserved, functionally important, or bounded by TF regulators across major projects (ENCODE, JASPAR, ReMap).": "从 UCSC 基因组浏览器获取进化保守性得分 (phyloP, phastCons) 和转录因子结合位点 (TFBS)。在分析主要项目（ENCODE、JASPAR、ReMap）的基因组变异或区域是否具有进化保守性、功能重要性，或是否受到 TF 调控因子约束时使用。",
      "Queries the UniBind database for experimentally validated transcription factor (TF) binding sites. Use when retrieving direct TF-DNA interaction datasets, downloading binding site coordinates (BED/FASTA) for local analysis, or listing available datasets by species, cell line, or TF name. Don't use to query specific intervals, locations, genes, motif models or expression data.": "在 UniBind 数据库中查询经实验验证的转录因子 (TF) 结合位点。当检索直接的 TF-DNA 相互作用数据集、下载结合位点坐标（BED/FASTA）进行本地分析，或按物种、细胞系或 TF 名称列出可用数据集时使用。不要用于查询特定的区间、位置、基因、基序模型或表达数据。",
      "Access protein metadata, function, taxonomy, and sequences across UniProtKB, UniParc, and UniRef. Use when searching for proteins, mapping identifiers, or retrieving functional annotations and publications. Don't use for sequence alignment, protein folding, or sequence similarity search (use specialized skills for those tasks).": "访问跨 UniProtKB、UniParc 和 UniRef 的蛋白质元数据、功能、分类和序列。在搜索蛋白质、映射标识符，或检索功能注释和出版物时使用。不要用于序列比对、蛋白质折叠或序列相似性搜索（针对这些任务请使用专用技能）。",
      "Checks whether the uv Python package manager is installed and installs it if missing. Ensures uv is on PATH. Use when another skill requires uv as a prerequisite.": "检查是否安装了 uv Python 包管理器，如果缺失则进行安装。确保 uv 位于 PATH 中。当其他技能需要 uv 作为先决条件时使用。"
    };

    // Merge new translations
    for (const [k, v] of Object.entries(newTranslations)) {
      dict[k] = v;
    }
    console.log(`已成功合并所有技能描述，共添加 ${Object.keys(newTranslations).length} 个键值对！`);

    // Sort dict by key length descending
    const sortedDict = {};
    Object.keys(dict).sort((a, b) => b.length - a.length).forEach(k => {
      sortedDict[k] = dict[k];
    });

    // Serialize back to the required format
    // Escape for inside the double-quoted key/value in dictionary definition
    // Outer quotes will be escaped as \", so inner quotes must be escaped as \\\"
    const escapeInner = (str) => {
      return str.replace(/\\/g, '\\\\').replace(/"/g, '\\\\\\\"');
    };

    let newDictStr = '{';
    const entries = Object.entries(sortedDict);
    entries.forEach(([k, v], idx) => {
      newDictStr += `\\"${escapeInner(k)}\\":\\"${escapeInner(v)}\\"`;
      if (idx < entries.length - 1) {
        newDictStr += ',';
      }
    });
    newDictStr += '}';

    // Replace dictionary definition in content
    const startIdxDict = content.indexOf('const dictionary = {');
    const endIdxDict = content.indexOf('};', startIdxDict);
    if (startIdxDict !== -1 && endIdxDict !== -1) {
      const oldDictDeclaration = content.substring(startIdxDict, endIdxDict + 2);
      const newDictDeclaration = `const dictionary = ${newDictStr};`;
      content = content.replace(oldDictDeclaration, newDictDeclaration);
    } else {
      console.error('未在 entry.new 中找到 dictionary 的声明边界');
      process.exit(1);
    }

    // Re-structure translateText function dynamically
    const startMarker = 'function translateText(value, node) {';
    const searchMarker = 'isInsideChatMessage(node)) return value;';
    
    const startIdx = content.indexOf(startMarker);
    if (startIdx !== -1) {
      const endSearchIdx = content.indexOf(searchMarker, startIdx);
      if (endSearchIdx !== -1) {
        const endLineIdx = content.indexOf('\\n', endSearchIdx);
        if (endLineIdx !== -1) {
          const oldHeaderBlock = content.substring(startIdx, endLineIdx + 2);
          
          const replacementHeader = 
            'function translateText(value, node) {\\n' +
            '    if (!value || (!/[A-Za-z]/.test(value) && value.trim() !== \\\'.\\\' && value.trim() !== \\\'?\\\' && value.trim() !== \\\'？\\\')) return value;\\n' +
            '    if (node && isInsideInputOrEditable(node)) return value;\\n' +
            '    const trimmed = value.trim();\\n' +
            '    if (!trimmed) return value;\\n' +
            '    const leadingSpaces = (value.match(/^\\\\s*/) || [\\\"\\\"])[0];\\n' +
            '    const trailingSpaces = (value.match(/\\\\s*$/) || [\\\"\\\"])[0];\\n' +
            '    const cleanTrimmed = trimmed.replace(/[\\\\u200b\\\\u200c\\\\u200d\\\\ufeff]/g, \'\');\\n' +
            '    const normalized = cleanTrimmed.replace(/\\\\s+/g, \' \');\\n' +
            '    const prefixRules = [\\n' +
            '      { prefix: \\\'for a protein. Use when\\\', trans: \\\'，用于蛋白质。当用户提供特定的 UniProt 访问 ID 并需要结构置信度指标 (pLDDT)、结构域边界分析或无序评估时使用。如果用户只有蛋白质名称、基因名称或氨基酸序列，请勿使用——请先询问 UniProt ID。\\\' },\\n' +
            '      { prefix: \\\'on gene expression (RNA-seq)\\\', trans: \\\'对基因表达 (RNA-seq)、染色质可及性 (DNASE)、组蛋白标记 (ChIP) 和转录因子的影响。当用户询问非编码变异效应、致病性、临床意义、疾病关联、功能效应、基因表达变化、剪接破坏或启动子和增强子中的调控效应时使用。也用于将生物学术语解析为组织/细胞类型本体 (UBERON/CL) 或以 chr:pos:ref>alt 格式分析变异。\\\' },\\n' +
            '      { prefix: \\\'including project creation, deployment\\\', trans: \\\'，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。\\\' },\\n' +
            '      { prefix: \\\'for bioactive molecules, drug targets\\\', trans: \\\'以获取生物活性分子、药物靶点、生物活性数据、批准药物和化学结构。当用户询问化合物、靶点、IC50/Ki 值、药物机制或结构搜索时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when you want to search for trials by condition\\\', trans: \\\'当您想根据疾病、药物、地点、状态或阶段搜索临床试验时使用；通过 NCT ID 获取试验详情；检查符合性/入组标准；统计不同疾病或时间段的试验数量；确定赞助商的试验组合；寻找招募中的试验以进行患者匹配。\\\' },\\n' +
            '      { prefix: \\\'Resolves between rsIDs\\\', trans: \\\'在 rsID、VCF 格式的基因组坐标和 HGVS 字符串之间进行解析。对于 rsID，返回变异类型、基因关联、临床意义、等位基因频率和基因组坐标 (GRCh38)。\\\' },\\n' +
            '      { prefix: \\\'Use when the user asks to search for terms\\\', trans: \\\'当用户要求搜索术语、获取详细信息、导航层级（父项、子项、祖先项）、查找属性和个体、获取自动补全建议，或访问本体元数据和统计信息时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when you want to query regulatory annotations\\\', trans: \\\'当您想查询人类细胞类型的调控注释或原始实验数据时使用。\\\' },\\n' +
            '      { prefix: \\\'Use this skill as a primary ID translator\\\', trans: \\\'将此技能用作主要的 ID 转换器、基因组序列数据库和变异效应预测工具。\\\' },\\n' +
            '      { prefix: \\\'Use ONLY when the user provides a physical 3D\\\', trans: \\\'仅当用户提供物理 3D 坐标文件（.cif、.mmcif 或 .pdb）并希望寻找结构相似的蛋白质时使用。如果用户仅提供蛋白质序列、基因名称或 UniProt ID，请勿使用。\\\' },\\n' +
            '      { prefix: \\\'Use when determining the rarity or allele frequency\\\', trans: \\\'在确定特定遗传变异的稀有性或等位基因频率、检索基因约束指标 (pLI, LOEUF) 以评估丧失功能耐受性、寻找基因组区域或基因中的变异，或查询结构变异时使用。不要用于分析单个患者基因组、追踪癌症体细胞突变（使用 COSMIC）或请求原始测序读取（使用 ENA）。\\\' },\\n' +
            '      { prefix: \\\'InterPro combines 14 databases\\\', trans: \\\'InterPro 将 14 个数据库（例如 Pfam, CDD）整合为一个可搜索的资源。InterPro-N 通过深度学习显著扩展了注释和序列覆盖面。包含域架构 (IDA) 搜索。\\\' },\\n' +
            '      { prefix: \\\'Use when retrieving Position Frequency Matrices\\\', trans: \\\'当检索特定 TF 的位置频率矩阵 (PFM) 或位置权重矩阵 (PWM)、将基因符号解析为 JASPAR 矩阵 ID 或获取 TF 元数据时使用。支持多种输出格式（MEME、TRANSFAC、PFM、JASPAR、YAML）。\\\' },\\n' +
            '      { prefix: \\\'Extract metadata, abstracts\\\', trans: \\\'提取元数据、摘要，并下载论文的全文 PDF 或 HTML 版本。当用户要求寻找研究论文、文献或特定 arXiv ID 时使用。\\\' },\\n' +
            '      { prefix: \\\'Supports fetching paper metadata by DOI\\\', trans: \\\'支持通过 DOI 获取论文元数据，并支持通过带有类别 and 关键字筛选的日期范围进行浏览。关键字筛选是本地的，因此日期范围必须狭窄（1-4 周）并指定类别以防止超时。\\\' },\\n' +
            '      { prefix: \\\'Retrieve full-text XML/plain text by PMCID\\\', trans: \\\'通过 PMCID 获取全文 XML/纯文本，获取引用列表和文献目录。\\\' },\\n' +
            '      { prefix: \\\'Use when searching academic papers, resolving DOIs\\\', trans: \\\'当搜索学术论文、解析 DOI、下载开放获取 PDF、寻找作者的出版物、汇总文献计量数据（引用次数、h 指数、影响因子）、探索研究分类法或进行 DOI 查找时使用。\\\' },\\n' +
            '      { prefix: \\\'Supports direct accession lookup\\\', trans: \\\'支持直接访问号查找、CDS 翻译、基因+生物体搜索、基因座查找、PubMed 链接的序列、专利蛋白质提取以及生物体+长度回退搜索。当您需要通过访问号、基因名称、基因座标签、PubMed ID 或专利号获取生物序列时使用。\\\' },\\n' +
            '      { prefix: \\\'Use for FDA adverse events, recalls\\\', trans: \\\'用于在所有 28 个 API 端点上进行 FDA 不良事件、召回、标签、批准、短缺、510(k) 许可、NDC 查找以及任何 FDA 安全或监管数据查询。\\\' },\\n' +
            '      { prefix: \\\'Supports searching by sequence similarity\\\', trans: \\\'支持通过序列相似性、结构相似性、化学和其他属性进行搜索。也用于获取关于生物大分子结构实验的元数据。\\\' },\\n' +
            '      { prefix: \\\'Use when you need to align multiple sequences to assess\\\', trans: \\\'当您需要比对多个序列以评估相似性、结构域保守性或关键残基保守性时使用。支持最多 4000 个序列，最大文件大小为 4 MB。不要用于在数据库中搜索同源蛋白质（使用 MMseqs2、BLAST）、比对非蛋白质序列（DNA、RNA）、进行结构比对（使用 Foldseek、PyMOL），或在您只有单个序列时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when a user asks about a specific chemical\\\', trans: \\\'当用户询问特定化学品、药物或分子时使用。\\\' },\\n' +
            '      { prefix: \\\'Fetch abstracts and full text.\\\', trans: \\\'获取摘要和全文。将已发表的研究链接到生物数据库（基因、蛋白质、核苷酸、PubChem），以发现论文与特定化合物或基因之间的关联。验证医学拼写，匹配原始引用，并缓存结果集以进行批量处理。接口连接 NCBI E-utilities 和 PMC BioC API。\\\' },\\n' +
            '      { prefix: \\\'Use when the user wants to create images of protein\\\', trans: \\\'当用户希望创建蛋白质结构图像、进行结构比对或叠加、测量距离或接触、突出显示结合位点或活性位点残基、按 B 因子/pLDDT 着色，或分析蛋白质-配体相互作用时使用。不要用于对接、分子动力学或纯序列分析。\\\' },\\n' +
            '      { prefix: \\\'Use this when you need to map genes to\\\', trans: \\\'当您需要将基因映射到生物学过程、分子功能或细胞成分，寻找与特定通路/GO 术语关联的基因，或探索基因本体层级时使用。不要用于查询药物靶点（使用 OpenTargets）或机械性信号传导通路图（使用 KEGG）。\\\' },\\n' +
            '      { prefix: \\\'Use when the user asks about pathway analysis\\\', trans: \\\'当用户询问通路分析、基因列表富集、通过 Token 获取结果、寻找未映射或未找到的标识符、映射标识符、反应参与者（输入、输出）、通路层级（包括顶级通路）、图表导出、交叉引用映射或搜索知识库时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when the user asks about interactions between\\\', trans: \\\'当用户询问特定蛋白质之间的相互作用、相互作用证据、置信度得分、蛋白质相互作用伙伴或通路富集时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when analyzing whether genomic variants\\\', trans: \\\'在分析主要项目（ENCODE、JASPAR、ReMap）的基因组变异或区域是否具有进化保守性、功能重要性，或是否受到 TF 调控因子约束时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when retrieving direct TF-DNA\\\', trans: \\\'当检索直接的 TF-DNA 相互作用数据集、下载结合位点坐标（BED/FASTA）进行本地分析，或按物种、细胞系或 TF 名称列出可用数据集时使用。不要用于查询特定的区间、位置、基因、基序模型或表达数据。\\\' },\\n' +
            '      { prefix: \\\'Use when searching for proteins, mapping\\\', trans: \\\'在搜索蛋白质、映射标识符，或检索功能注释和出版物时使用。不要用于序列比对、蛋白质折叠或序列相似性搜索（针对这些任务请使用专用技能）。\\\' },\\n' +
            '      { prefix: \\\'Ensures uv is on PATH\\\', trans: \\\'确保 uv 位于 PATH 中。当其他技能需要 uv 作为先决条件时使用。\\\' },\\n' +
            '      { prefix: \\\'Use when the user asks to turn their workflow\\\', trans: \\\'当用户要求将他们的工作流、交互或多步骤过程转变为技能，或者他们说“将此制作成技能”、“从我们刚才的操作中创建一个技能”、“打包此工作流”或类似内容时使用。如果没有现有的工作流，请勿用于从头创建技能（为此请使用通用的技能创建器）。\\\' },\\n' +
            '      { prefix: \\\'Distills a completed user workflow\\\', trans: \\\'将完成的用户工作流或交互提炼为可重用的智能体技能。当用户要求将他们的工作流、交互或多步骤过程转变为技能，或者他们说“将此制作成技能”、“从我们刚才的操作中创建一个技能”、“打包此工作流”或类似内容时使用。如果没有现有的工作流，请勿用于从头创建技能（为此请使用通用的技能创建器）。\\\' },\\n' +
            '      { prefix: \\\'Use when needing clinical significance\\\', trans: \\\'在需要临床意义、致病性分类（例如，致病、良性、VUS）、临床证据原理，或为人类基因组变异寻找“强阳性”基准对照时使用。\\\' }\\n' +
            '    ];\\n' +
            '    for (let i = 0; i < prefixRules.length; i++) {\\n' +
            '      if (normalized.toLowerCase().startsWith(prefixRules[i].prefix.toLowerCase())) {\\n' +
            '        return leadingSpaces + prefixRules[i].trans + trailingSpaces;\\n' +
            '      }\\n' +
            '    }\\n' +
            // UI force-translate amnesty rules
            '    if (normalized === \\\'Cancel\\\') return leadingSpaces + \\\'取消\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Delete\\\') return leadingSpaces + \\\'删除\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Files\\\') return leadingSpaces + \\\'文\\\' + \\\'\\u2060\\\' + \\\'件\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Walkthrough\\\') return leadingSpaces + \\\'验收文档\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Task\\\') return leadingSpaces + \\\'任务清单\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Implementation Plan\\\') return leadingSpaces + \\\'实现计划\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Auto-proceeded with\\\') return leadingSpaces + \\\'自动执行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Analyzed\\\') return leadingSpaces + \\\'分析了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Searched\\\') return leadingSpaces + \\\'搜索了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Edited\\\') return leadingSpaces + \\\'编辑了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Ran\\\') return leadingSpaces + \\\'运行了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Checked\\\') return leadingSpaces + \\\'检查了\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Killed\\\') return leadingSpaces + \\\'已终止\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Comment Ctrl+Alt+M\\\') return leadingSpaces + \\\'评论 Ctrl+Alt+M\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Cancel All Tasks\\\') return leadingSpaces + \\\'取消所有任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Explored\\\') return leadingSpaces + \\\'已探索\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Exploring\\\') return leadingSpaces + \\\'正在探索\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run\\\') return leadingSpaces + \\\'运行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'file\\\') return leadingSpaces + \\\'文\\\' + \\\'\\u2060\\\' + \\\'件\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'File\\\') return leadingSpaces + \\\'文\\\' + \\\'\\u2060\\\' + \\\'件\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'artifact\\\') return leadingSpaces + \\\'产物\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Artifact\\\') return leadingSpaces + \\\'产物\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'scratch\\\') return leadingSpaces + \\\'草稿\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'test\\\') return leadingSpaces + \\\'测试\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'more lines\\\') return leadingSpaces + \\\'更多行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Match case (Aa)\\\') return leadingSpaces + \\\'区分大小写 (Aa)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Match whole word (ab)\\\') return leadingSpaces + \\\'全字匹配 (ab)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Show\\\') return leadingSpaces + \\\'显示\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'more\\\') return leadingSpaces + \\\'更多\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Thought Process\\\') return leadingSpaces + \\\'思考过程\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Cancel Task\\\') return leadingSpaces + \\\'取消任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Copy Command\\\') return leadingSpaces + \\\'复制命令\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Previous match (Shift+Enter)\\\') return leadingSpaces + \\\'上一个匹配项 (Shift+Enter)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Next match (Enter)\\\') return leadingSpaces + \\\'下一个匹配项 (Enter)\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'User cancelled agent execution.\\\') return leadingSpaces + \\\'用户取消了智能体执行。\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run tests finished\\\') return leadingSpaces + \\\'测试运行完成\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Open Diff\\\') return leadingSpaces + \\\'打开对比\\\' + trailingSpaces;\\n' +
            '    if (/^Working\\\\s+directory\\\\s*(:|：)?$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^Working\\\\s+directory\\\\s*(:|：)?$/i);\\n' +
            '      const colon = match[1] ? \\\'：\\\' : \\\'\\\';\\n' +
            '      return leadingSpaces + \\\'工作目录\\\' + colon + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (normalized === \\\'Search for files in the project...\\\') return leadingSpaces + \\\'在项目中搜索文件...\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Search all convos...\\\') return leadingSpaces + \\\'搜索所有对话...\\\' + trailingSpaces;\\n' +
            '    if (/^Search\\\\s+projects\\\\b\\\\.{0,3}$/i.test(normalized)) return leadingSpaces + \\\'搜索项目...\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Command execution finished\\\') return leadingSpaces + \\\'命令执行完成\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Stop Task\\\') return leadingSpaces + \\\'停止任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Media\\\') return leadingSpaces + \\\'媒体\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Thinking\\\') return leadingSpaces + \\\'正在思考\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Thinking...\\\') return leadingSpaces + \\\'正在思考...\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'result\\\') return leadingSpaces + \\\'结果\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'results\\\') return leadingSpaces + \\\'结果\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Copied\\\') return leadingSpaces + \\\'已复制\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Copy Content\\\') return leadingSpaces + \\\'复制内容\\\' + trailingSpaces;\\n' +
            '    if (/^View\\\\s+Diff\\\\b/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/^View\\\\s+Diff\\\\b/i, \\\'查看对比\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Viewing\\\\s+Diff\\\\b/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/^Viewing\\\\s+Diff\\\\b/i, \\\'正在查看对比\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^File\\\\s+not\\\\s+found\\\\b/i.test(normalized)) {\\n' +
            '      return leadingSpaces + \\\'未找到文件\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/including\\\\s+project\\\\s+creation/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/[，,\\\\s]*including\\\\s+project\\\\s+creation.*/i, \\\'，包括使用 android 命令行工具进行项目创建、部署、SDK 管理和环境诊断。\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Stop\\\\s+Recording$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + \\\'停止录制\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Finalizing(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在收尾...\\\' : \\\'正在收尾\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Stop\\\\s+Recording\\\\s+Ctrl\\\\+M$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + \\\'停止录制 Ctrl+M\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Path\\\\s+copied(!)?$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^Path\\\\s+copied(!)?$/i);\\n' +
            '      const excl = match[1] ? \\\'！\\\' : \\\'\\\';\\n' +
            '      return leadingSpaces + \\\'路径已复制\\\' + excl + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Are\\\\s+you\\\\s+sure\\\\s+you\\\\s+want\\\\s+to\\\\s+delete\\\\s+the\\\\s+project\\\\s+([^?？]+)/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/Are\\\\s+you\\\\s+sure\\\\s+you\\\\s+want\\\\s+to\\\\s+delete\\\\s+the\\\\s+project\\\\s+([^?？]+)/i);\\n' +
            '      return leadingSpaces + \\\'您确定要删除项目 \\\' + match[1].trim() + \\\' 吗？\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/This\\\\s+will\\\\s+permanently\\\\s+delete\\\\s+(.+?)\\\\s+within\\\\s+it/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/This\\\\s+will\\\\s+permanently\\\\s+delete\\\\s+(.+?)\\\\s+within\\\\s+it/i);\\n' +
            '      return leadingSpaces + \\\'这将永久删除其中的 \\\' + match[1].trim() + \\\'。此操作无法撤销。\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Are\\\\s+you\\\\s+sure\\\\s+you\\\\s+want\\\\s+to\\\\s+delete\\\\s+the\\\\s+project$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + \\\'您确定要删除项目\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^This\\\\s+will\\\\s+permanently\\\\s+delete$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + \\\'这将永久删除其中的\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^within\\\\s+it\\\\.\\\\s*This\\\\s+action\\\\s+cannot\\\\s+be\\\\s+undone\\\\.$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + \\\'。此操作无法撤销。\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (normalized === \\\'?\\\' || normalized === \\\'？\\\') {\\n' +
            '      let sibling = node && node.previousSibling;\\n' +
            '      while (sibling) {\\n' +
            '        const txt = sibling.textContent || \\\'\\\';\\n' +
            '        if (txt.includes(\\\'delete the project\\\') || txt.includes(\\\'确定要删除项目\\\')) {\\n' +
            '          return leadingSpaces + \\\' 吗？\\\' + trailingSpaces;\\n' +
            '        }\\n' +
            '        sibling = sibling.previousSibling;\\n' +
            '      }\\n' +
            '    }\\n' +
            '    if (/^Plugin\\\\s*:\\\\s*(.+)$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^Plugin\\\\s*:\\\\s*(.+)$/i);\\n' +
            '      return leadingSpaces + \\\'插件：\\\' + translateText(match[1], null) + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^插件\\\\s*[：:]\\\\s*(.+)$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^插件\\\\s*[：:]\\\\s*(.+)$/i);\\n' +
            '      return leadingSpaces + \\\'插件：\\\' + translateText(match[1], null) + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^plugins?\\\\s*[:：]?$/i.test(normalized)) {\\n' +
            '      const hasColon = /[:：]/.test(normalized);\\n' +
            '      return leadingSpaces + \\\'插件\\\' + (hasColon ? \\\'：\\\' : \\\'\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (normalized.toLowerCase() === \\\'science\\\') return leadingSpaces + \\\'科学\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'android-cli-plugin\\\') return leadingSpaces + \\\'Android CLI 插件\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'android-cli\\\') return leadingSpaces + \\\'Android CLI\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'chrome-devtools-plugin\\\') return leadingSpaces + \\\'Chrome 开发者工具插件\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'firebase\\\') return leadingSpaces + \\\'Firebase\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'flutter\\\') return leadingSpaces + \\\'Flutter\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'google-antigravity-sdk\\\') return leadingSpaces + \\\'Google Antigravity SDK\\\' + trailingSpaces;\\n' +
            '    if (normalized.toLowerCase() === \\\'modern-web-guidance-plugin\\\') return leadingSpaces + \\\'现代 Web 指导插件\\\' + trailingSpaces;\\n' +
            '    if (/^You\\\\s+need\\\\s+at\\\\s+least\\\\s+(\\\\d+)\\\\s+AI\\\\s+Credits\\\\s+to\\\\s+send\\\\s+messages\\\\.\\\\s+To\\\\s+continue\\\\s+using\\\\s+(.+?)\\\\s+now,\\\\s+purchase\\\\s+more\\\\s+AI\\\\s+Credits\\\\.\\\\s+Your\\\\s+plan\\\\\\\'s\\\\s+baseline\\\\s+quota\\\\s+will\\\\s+refresh\\\\s+on\\\\s+(.+)$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^You\\\\s+need\\\\s+at\\\\s+least\\\\s+(\\\\d+)\\\\s+AI\\\\s+Credits\\\\s+to\\\\s+send\\\\s+messages\\\\.\\\\s+To\\\\s+continue\\\\s+using\\\\s+(.+?)\\\\s+now,\\\\s+purchase\\\\s+more\\\\s+AI\\\\s+Credits\\\\.\\\\s+Your\\\\s+plan\\\\\\\'s\\\\s+baseline\\\\s+quota\\\\s+will\\\\s+refresh\\\\s+on\\\\s+(.+)$/i);\\n' +
            '      const credits = match[1];\\n' +
            '      const model = match[2].replace(/\\\\bFIash\\\\b/gi, \\\'Flash\\\').replace(/\\\\bMedium\\\\b/gi, \\\'中等\\\');\\n' +
            '      const time = match[3];\\n' +
            '      return leadingSpaces + \\\'您至少需要 \\\' + credits + \\\' 个 AI 点数才能发送消息。若要现在继续使用 \\\' + model + \\\',请购买更多 AI 点数。您的方案基准配额将在 \\\' + time + \\\' 刷新。\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (normalized === \\\'lines\\\') return leadingSpaces + \\\'行\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Ask a quick question without interrupting the main conversation.\\\') return leadingSpaces + \\\'在不中断主对话的情况下快速提问。\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Automated Tests\\\') return leadingSpaces + \\\'自动化测试\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run until the specified goal is completely finished\\\') return leadingSpaces + \\\'运行直到指定目标完全完成\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Run an instruction on a recurring schedule or as a one-time timer\\\') return leadingSpaces + \\\'按周期性计划或作为一次性定时器运行指令\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Invoke a browser agent for web tasks\\\') return leadingSpaces + \\\'调用浏览器智能体执行网页任务\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Interview me to align on a plan\\\') return leadingSpaces + \\\'通过面谈对齐计划\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Invoke a team of agents to autonomously tackle large projects\\\') return leadingSpaces + \\\'调用智能体团队自主应对大型项目\\\' + trailingSpaces;\\n' +
            '    if (normalized === \\\'Reflect on recent successes or corrections to capture reusable skills or rules\\\') return leadingSpaces + \\\'回顾近期成功或修正以捕获可重用的技能或规则\\\' + trailingSpaces;\\n' +
            '    if (/^Working(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在工作...\\\' : \\\'正在工作\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Editing(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在编辑...\\\' : \\\'正在编辑\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^See\\\\s+all(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'查看全部...\\\' : \\\'查看全部\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^See\\\\s+all\\\\s*\\\\((\\\\d+)\\\\)$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/See\\\\s+all\\\\s*\\\\((\\\\d+)\\\\)/gi, \\\'查看全部 ($1)\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Thinking\\\\s+for(\\\\.\\\\.\\\\.)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + (normalized.endsWith(\\\'...\\\') ? \\\'正在思考...\\\' : \\\'正在思考\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^Thinking\\\\s+for\\\\s+(.+)$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Thinking\\\\s+for\\\\s+(.+)/gi, \\\'已思考 $1\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\+\\\\s*(\\\\d+)\\\\s+more\\\\s+lines$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/\\\\+\\\\s*(\\\\d+)\\\\s+more\\\\s+lines/gi, \\\'另外 $1 行\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            // Handle quantity-only split text node translations (e.g. "1 file", "1 artifact")
            '    if (/^\\\\d+\\\\s+folders?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+folders?/gi, \\\'$1 个文件夹\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+files?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+files?/gi, \\\'$1 个文件\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+search(?:es)?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+search(?:es)?/gi, \\\'$1 次搜索\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+tasks?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+tasks?/gi, \\\'$1 个任务\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+artifacts?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+artifacts?/gi, \\\'$1 个产物\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+results?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+results?/gi, \\\'$1 个结果\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/^\\\\d+\\\\s+lines?$/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/(\\\\d+)\\\\s+lines?/gi, \\\'$1 行\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            // Handle artifact items with date/time stamps
            '    if (/^(Implementation Plan|Task|Walkthrough|Media|File|Artifact|Scratch)\\\\s*\\\\((.+)\\\\)$/i.test(normalized)) {\\n' +
            '      const match = normalized.match(/^(Implementation Plan|Task|Walkthrough|Media|File|Artifact|Scratch)\\\\s*\\\\((.+)\\\\)$/i);\\n' +
            '      const typeMap = {\\n' +
            '        \\\'implementation plan\\\': \\\'实现计划\\\',\\n' +
            '        \\\'task\\\': \\\'任务清单\\\',\\n' +
            '        \\\'walkthrough\\\': \\\'验收文档\\\',\\n' +
            '        \\\'media\\\': \\\'媒体\\\',\\n' +
            '        \\\'file\\\': \\\'文\\\' + \\\'\\u2060\\\' + \\\'件\\\',\\n' +
            '        \\\'artifact\\\': \\\'产物\\\',\\n' +
            '        \\\'scratch\\\': \\\'草稿\\\'\\n' +
            '      };\\n' +
            '      const chineseType = typeMap[match[1].toLowerCase()] || match[1];\\n' +
            '      const inner = match[2]\\n' +
            '        .replace(/\\\\bToday\\\\b/gi, \\\'今天\\\')\\n' +
            '        .replace(/\\\\bYesterday\\\\b/gi, \\\'昨天\\\');\\n' +
            '      return leadingSpaces + chineseType + \\\' (\\\' + inner + \\\')\\\' + trailingSpaces;\\n' +
            '    }\\n' +
            // High tolerance regex translation rules (without ^ and $ anchors)
            '    if (/Show\\\\s+(\\\\d+)\\\\s+more/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Show\\\\s+(\\\\d+)\\\\s+more/gi, \\\'显示另外 $1 项\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+folders?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+folders?/gi, \\\'探索了 $1 个文件夹\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+files?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+files?/gi, \\\'探索了 $1 个文件\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+search(?:es)?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+search(?:es)?/gi, \\\'探索了 $1 次搜索\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+tasks?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+tasks?/gi, \\\'探索了 $1 个任务\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Explored\\\\s+(\\\\d+)\\\\s+artifacts?/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Explored\\\\s+(\\\\d+)\\\\s+artifacts?/gi, \\\'探索了 $1 个产物\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (/Thought\\\\s+for\\\\s+(\\\\d+(?:\\\\.\\\\d+)?\\\\w+)/i.test(normalized)) {\\n' +
            '      return leadingSpaces + normalized.replace(/Thought\\\\s+for\\\\s+(\\\\d+(?:\\\\.\\\\d+)?\\\\w+)/gi, \\\'思考了 $1\\\') + trailingSpaces;\\n' +
            '    }\\n' +
            '    if (node && isInsideChatMessage(node)) return value;\\n';
          
          content = content.replace(oldHeaderBlock, replacementHeader);
          console.log('成功重组 translateText 执行层次，并注入新版特赦与拆分节点正则规则！');
        } else {
          console.error('未在 endSearchIdx 后面定位到换行符');
          process.exit(1);
        }
      } else {
        console.error('未在 content 中定位到 searchMarker');
        process.exit(1);
      }
    } else {
      console.error('未在 content 中定位到 startMarker');
      process.exit(1);
    }

    entry.new = content;
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    console.log('成功将所有更新写回 translations.json！');
  } else {
    console.error('未匹配到 dictionary 对象');
  }
} else {
  console.error('未找到注入项');
}
