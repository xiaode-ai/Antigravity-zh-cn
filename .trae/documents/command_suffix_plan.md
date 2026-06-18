# Antigravity IDE 翻译命令统一后缀改造计划

## 一、需求分析

用户希望为现有的翻译命令增加统一后缀参数，使命令格式变为：
- `npm run translate ide`
- `npm run rollback ide`
- `npm run check ide`
- `npm run scan ide`
- `npm run prune ide`

当前命令格式为：
- `npm run translate`（直接执行，无目标类型参数）

## 二、修改范围

### 2.1 文件清单

| 文件 | 修改内容 |
|------|----------|
| `package.json` | 修改 scripts 脚本，传递目标类型参数 |
| `src/index.js` | 增加目标类型参数解析与传递 |
| `src/translate.js` | 接收并处理 targetType 参数 |
| `src/rollback.js` | 接收并处理 targetType 参数 |
| `src/check.js` | 接收并处理 targetType 参数 |
| `src/scan.js` | 接收并处理 targetType 参数 |
| `src/prune.js` | 接收并处理 targetType 参数 |

### 2.2 核心变更逻辑

1. **命令行参数解析**：`process.argv[3]` 作为目标类型参数（如 `ide`）
2. **配置适配**：根据 targetType 加载对应配置或路径
3. **向后兼容**：未指定参数时默认使用 `ide` 作为目标类型

## 三、实施步骤

### 步骤 1：修改 package.json

将现有 scripts 改为传递额外参数：
```json
{
  "scripts": {
    "translate": "node src/index.js translate",
    "rollback": "node src/index.js rollback",
    "check": "node src/index.js check",
    "scan": "node src/index.js scan",
    "prune": "node src/index.js prune"
  }
}
```

npm run 会自动传递后续参数给脚本，因此无需修改 scripts 定义。

### 步骤 2：修改 src/index.js

- 解析 `process.argv[3]` 作为 targetType
- 默认值为 `ide`
- 将 targetType 传递给所有子命令函数

### 步骤 3：修改各子模块函数签名

为 `translate`, `rollback`, `check`, `scan`, `prune` 函数增加 `targetType` 参数。

## 四、风险与注意事项

1. **向后兼容性**：确保不传参数时默认使用 `ide`，不影响现有使用方式
2. **参数验证**：对非法 targetType 值进行校验和提示
3. **配置文件**：当前 config.json 已配置为 IDE 路径，后续如需支持其他目标类型可扩展配置

## 五、验证方案

执行以下命令验证：
1. `npm run translate ide` - 正常汉化
2. `npm run translate` - 默认使用 ide，正常汉化
3. `npm run rollback ide` - 正常回滚
4. `npm run check ide` - 正常校验
5. `npm run scan ide` - 正常扫描
6. `npm run prune ide` - 正常剪裁