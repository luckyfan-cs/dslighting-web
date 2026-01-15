# 配置说明

DSLighting 通过配置文件和环境变量进行灵活配置。

## 环境变量配置

在项目根目录创建 `.env` 文件。

### 基础配置

```bash
# LLM API 配置
API_KEY=your_api_key_here
API_BASE=https://api.openai.com/v1

# 其他配置
LOG_PATH=runs/benchmark_results
MAX_WORKERS=4
```

### LLM 模型配置（高级）

DSLighting 支持通过 `LLM_MODEL_CONFIGS` 配置多个 LLM 模型及其参数：

#### 配置格式

**重要**：两种配置格式（互斥）：

**格式1：使用 `provider` 字段**（推荐用于自定义提供商）
```json
{
  "model-name": {
    "provider": "openai",
    "api_key": "sk-xxx",
    "api_base": "https://api.example.com/v1"
  }
}
```

**格式2：使用 `openai/` 前缀**（用于 OpenAI 兼容的 API）
```json
{
  "openai/model-name": {
    "api_key": "sk-xxx",
    "api_base": "https://api.example.com/v1"
  }
}
```

⚠️ **警告**：不要同时使用 `provider` 和 `openai/` 前缀！

#### 完整配置示例

```bash
LLM_MODEL_CONFIGS='{
  "gpt-4o": {
    "api_key": "sk-openai-placeholder-key",
    "api_base": "https://api.openai.com/v1",
    "temperature": 0.7
  },

  "glm-4.7": {
    "provider": "openai",
    "api_key": "your-zhipu-api-key-here",
    "api_base": "https://open.bigmodel.cn/api/paas/v4",
    "temperature": 1.0
  },

  "openai/deepseek-ai/DeepSeek-V3": {
    "api_key": [
      "sk-siliconflow-key-1",
      "sk-siliconflow-key-2"
    ],
    "api_base": "https://api.siliconflow.cn/v1",
    "temperature": 1.0
  },

  "openai/Qwen/Qwen2.5-72B-Instruct": {
    "api_key": "sk-siliconflow-key-here",
    "api_base": "https://api.siliconflow.cn/v1",
    "temperature": 0.8
  }
}'
```

---

## 支持的 LLM 提供商

### 1. OpenAI（官方）

- **网站**: https://openai.com/
- **模型**: gpt-4, gpt-4o, gpt-3.5-turbo 等
- **获取密钥**: https://platform.openai.com/api-keys

```bash
API_KEY=sk-xxx
API_BASE=https://api.openai.com/v1
```

### 2. 硅基流动（国内推荐）

- **网站**: https://siliconflow.cn/
- **模型**: DeepSeek-V3, Qwen2.5-72B-Instruct 等
- **获取密钥**: https://siliconflow.cn/account/ak
- **API Base**: https://api.siliconflow.cn/v1

```bash
API_KEY=your_siliconflow_api_key
API_BASE=https://api.siliconflow.cn/v1
```

### 3. 智谱AI（国内推荐）

- **网站**: https://bigmodel.cn/
- **模型**: glm-4, glm-4-plus, glm-4-air 等
- **获取密钥**: https://open.bigmodel.cn/usercenter/apikeys
- **API Base**: https://open.bigmodel.cn/api/paas/v4

```bash
API_KEY=your_zhipu_api_key
API_BASE=https://open.bigmodel.cn/api/paas/v4
```

---

## 高级配置特性

### API 密钥轮换

支持配置多个 API 密钥，系统会自动轮换使用以实现负载均衡：

```json
{
  "model-name": {
    "api_key": [
      "sk-key-1",
      "sk-key-2",
      "sk-key-3"
    ]
  }
}
```

### Temperature 参数

控制模型输出的随机性：

- **0.0-0.3**: 更专注和确定性的输出
- **0.4-0.7**: 创造性和一致性的平衡
- **0.8-1.5**: 更有创造性和随机性

---

## config.yaml 配置

主配置文件 `config.yaml` 包含以下部分：

### Competitions 配置

```yaml
competitions:
  - bike-sharing-demand
  - titanic
  - house-prices
```

### 模型定价配置

```yaml
custom_model_pricing:
  gpt-4:
    input: 0.03
    output: 0.06
  gpt-3.5-turbo:
    input: 0.0015
    output: 0.002
```

### 日志配置

```yaml
run:
  log_artifacts: true
  log_traces: true
  save_code: true
```

---

## 工作流配置

每个工作流都可以有独立的配置：

### AIDE 配置

```yaml
aide:
  max_iterations: 10
  temperature: 0.7
  review_threshold: 0.8
```

### DSAgent 配置

```yaml
dsagent:
  max_steps: 20
  planning_iterations: 3
  execution_timeout: 300
```

---

## 运行时参数

通过命令行参数覆盖配置：

```bash
python run_benchmark.py \
  --workflow aide \
  --llm-model gpt-4 \
  --temperature 0.8 \
  --max-iterations 15
```

---

## Web UI 配置

Web UI 的配置文件位于 `web_ui/backend/.env`：

```bash
# 后端配置
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8003
CORS_ORIGINS=http://localhost:3000

# 前端配置
NEXT_PUBLIC_API_URL=http://localhost:8003
```

---

查看[常见问题](/guide/faq)解决配置问题。
