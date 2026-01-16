# 快速上手

欢迎使用 `dslighting`！本指南将引导您在 5 分钟内安装、配置并成功运行您的第一个数据科学任务。

## 1. 创建 Python 环境

首先，创建一个独立的 Python 环境（推荐使用 `venv` 或 `conda`）：

```bash
# 使用 venv 创建虚拟环境（需要 Python 3.10+）
python3.10 -m venv dslighting-env
source dslighting-env/bin/activate  # Linux/Mac
# 或
dslighting-env\Scripts\activate  # Windows
```

**系统要求:**
- Python 3.10 或更高版本
- 推荐使用 Python 3.10 或 3.11

## 2. 安装 dslighting

通过 `pip` 安装 `dslighting`：

```bash
pip install dslighting
```

## 3. 配置环境变量

创建一个 `.env` 文件来配置您的 LLM API 密钥和模型参数。**DSLighting 会自动读取 `.env` 文件，无需额外配置！**

### .env 文件示例

在项目根目录创建 `.env` 文件：

```bash
# .env

# 默认模型
LLM_MODEL="glm-4"

# 默认温度参数
LLM_TEMPERATURE=0.7

# 默认 API 配置（可选）
API_KEY="your-default-api-key"
API_BASE="https://api.openai.com/v1"

# 多模型配置（JSON 格式）
LLM_MODEL_CONFIGS='{
  "glm-4": {
    "api_key": "your-zhipu-api-key-here",
    "api_base": "https://open.bigmodel.cn/api/paas/v4",
    "temperature": 1.0,
    "provider": "openai"
  },

  "openai/deepseek-ai/DeepSeek-V3": {
    "api_key": [
      "sk-siliconflow-key-1",
      "sk-siliconflow-key-2",
      "sk-siliconflow-key-3"
    ],
    "api_base": "https://api.siliconflow.cn/v1",
    "temperature": 1.0
  },

  "openai/Qwen/Qwen2.5-72B-Instruct": {
    "api_key": "sk-siliconflow-key-here",
    "api_base": "https://api.siliconflow.cn/v1",
    "temperature": 0.8
  },

  "gpt-4o": {
    "api_key": "sk-your-openai-api-key",
    "api_base": "https://api.openai.com/v1",
    "temperature": 0.7
  }
}'
```

**配置说明:**

- **`LLM_MODEL`**: 默认使用的模型名称
- **`LLM_TEMPERATURE`**: 默认温度参数
- **`LLM_MODEL_CONFIGS`**: JSON 格式的多模型配置
  - `api_key`: 可以是单个字符串或字符串数组（支持轮询）
  - `api_base`: API 端点地址
  - `temperature`: 模型温度参数（0.0-2.0）
  - `provider`: 提供商类型（可选）

**支持的模型提供商:**
- OpenAI (GPT-4, GPT-3.5)
- 智谱 AI (GLM-4)
- SiliconFlow (DeepSeek, Qwen, Kimi 等)
- 任何兼容 OpenAI API 的服务

## 4. 运行任务

DSLighting 提供两种运行方式：

### ✅ 方式 1：直接指定 task_id（推荐）

最简洁的方式，直接指定任务 ID：

```python
# run.py
import dslighting

def main():
    agent = dslighting.Agent(
        workflow="aide",
        model="glm-4",
        temperature=0.7,
        max_iterations=5
    )

    # 直接运行
    result = agent.run(
        task_id="bike-sharing-demand",              # 任务 ID
        data_dir="/path/to/dslighting/data/competitions"  # 数据目录（可选）
    )

    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
```

**优势：**
- ✅ 代码简洁
- ✅ 显式指定 task_id，意图清晰
- ✅ 自动检查注册表
- ✅ 更好的错误提示

---

### 方式 2：先加载数据，再运行（用于调试）

适合需要先查看数据结构的场景：

```python
# run.py
import dslighting

def main():
    # 1. 先加载数据
    data = dslighting.load_data(
        "/path/to/dslighting/data/competitions/bike-sharing-demand",
        registry_dir="/path/to/dslighting/benchmarks/mlebench/competitions"
    )

    # 2. 查看数据结构（可选）
    print(data.show())

    # 3. 创建 Agent 并运行
    agent = dslighting.Agent(
        workflow="aide",
        model="glm-4",
        max_iterations=5
    )

    result = agent.run(data)  # 传入 LoadedData 对象

    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
```

**适用场景：**
- 想先查看数据结构（使用 `data.show()`）
- 调试数据处理
- 需要访问 LoadedData 的其他属性

---

### 💡 推荐做法

**日常使用：** 用方式 1（简洁）
```python
result = agent.run(task_id="bike-sharing-demand")
```

**调试时：** 先用 `load_data()` 查看数据，再运行
```python
data = dslighting.load_data(...)
print(data.show())  # 查看数据结构
result = agent.run(data)
```

## 4.5 查看数据结构

使用你自己的 mle-bench 格式竞赛数据：

```python
# run_custom.py
import dslighting

def main():
    # 配置 mle-bench 格式路径
    # 数据路径：指向竞赛数据目录
    DATA_PATH = "/path/to/dslighting/data/competitions/bike-sharing-demand"

    # 注册路径：指向竞赛注册目录
    REGISTRY_PATH = "/path/to/dslighting/benchmarks/mlebench/competitions"

    # 加载数据（DSLighitng 会自动查找对应的注册配置）
    data = dslighting.load_data(
        DATA_PATH,
        registry_dir=REGISTRY_PATH
    )

    # 创建 Agent
    agent = dslighting.Agent(
        model="glm-4",
        max_iterations=5
    )

    # 运行任务
    result = agent.run(data)

    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
```

## 4.5 查看数据结构（可选）

DSLighting 提供了与 Agent 一致的数据视角，帮助你在运行任务前了解数据：

```python
# explore_data.py
import dslighting

def main():
    # 配置路径
    DATA_PATH = "/path/to/dslighting/data/competitions/bike-sharing-demand"
    REGISTRY_PATH = "/path/to/dslighting/benchmarks/mlebench/competitions"

    # 加载数据
    data = dslighting.load_data(
        DATA_PATH,
        registry_dir=REGISTRY_PATH
    )

    # 简短查看
    print(data)
    # 输出示例: LoadedData(task_id='bike-sharing-demand', task_type='kaggle')

    # 详细查看数据结构和 schema
    print("\n=== 数据结构详情 ===")
    print(data.show())

if __name__ == "__main__":
    main()
```

**`data.show()` 输出内容:**

- **任务信息**
  - `task_id`: 任务标识符（如 `bike-sharing-demand`）
  - `task_type`: 任务类型（如 `kaggle`、`openml`）
  - `recommended_workflow`: 推荐的工作流类型

- **数据目录结构**
  - `prepared/public/`: 预处理后的公开数据
  - `prepared/private/`: 预处理后的私有数据（标签）
  - `raw/`: 原始数据

- **CSV 文件信息**
  - 每个文件的列名和数据类型
  - 文件大小和行数
  - 特征类型（数值、类别、时间等）

- **任务描述**
  - 任务目标和要求
  - 输入输出格式
  - 评估指标

**为什么这很有用？**

- ✅ 了解 Agent 将如何处理数据
- ✅ 在运行前验证数据格式正确
- ✅ 快速理解竞赛要求
- ✅ 调试数据加载问题

这就是 Agent 看到的数据！通过 `data.show()`，你可以完全理解 Agent 的数据视角。

## 5. 运行脚本

在终端中运行：

```bash
python run.py
```

或使用自定义数据：

```bash
python run_custom.py
```

## 6. 查看结果

脚本运行后，DSLighting 会在 `REGISTRY_DIR` 指定的目录下创建输出文件：

```
registry/
├── tasks/                    # 任务记录
│   └── bike-sharing-demand/
│       └── 1/                # 运行实例 ID
│           ├── input/        # 输入数据
│           ├── artifacts/     # 生成的结果
│           │   ├── eda_report.md
│           │   └── analysis_results.json
│           ├── snapshot/     # 运行快照
│           └── task.log      # 任务日志
└── workspace/                # 工作空间（如果 keep_workspace=True）
```

## 7. API 参数说明

### Agent 参数

- **`workflow`**: 工作流类型
  - `"aide"`: AI 驱动的探索工作流（推荐用于数据分析）
  - `"automind"`: 自动化机器学习工作流
  - `"dsagent"`: 数据科学智能体工作流

- **`model`**: 使用的模型名称
  - 必须与 `.env` 中 `LLM_MODEL_CONFIGS` 定义的模型名称匹配
  - 例如: `"glm-4"`, `"gpt-4o"`, `"openai/deepseek-ai/DeepSeek-V3"` 等

- **`temperature`**: 模型创造性参数（0.0-2.0）
  - `0.0`: 更确定性，输出更稳定
  - `1.0`: 平衡
  - `2.0`: 更创造性，更多样化

- **`max_iterations`**: Agent 最大迭代次数
  - 建议值: 3-10 次
  - 次数越多，探索越深入，但耗时越长

- **`keep_workspace`**: 是否保留工作空间
  - `True`: 保留中间结果，便于调试
  - `False`: 清理临时文件，节省空间

### 数据加载参数

- **`DATA_PATH`**: mle-bench 格式的竞赛数据路径
  - 指向具体竞赛目录，如: `/path/to/data/competitions/bike-sharing-demand`
  - 包含 `prepared/` 和 `raw/` 子目录
  - 必须是 mle-bench 标准格式

- **`REGISTRY_DIR`**: 竞赛注册配置路径
  - 指向注册目录的父目录，如: `/path/to/benchmarks/mlebench/competitions`
  - DSLighitng 会根据竞赛名称自动查找对应的 `config.yaml`
  - 包含评分脚本、准备脚本等配置文件

## 8. 高级配置

### 使用多个 API 密钥（轮询）

在 `.env` 中配置多个密钥，DSLighting 会自动轮询使用：

```bash
LLM_MODEL_CONFIGS='{
  "glm-4": {
    "api_key": [
      "sk-key-1",
      "sk-key-2",
      "sk-key-3"
    ],
    "api_base": "https://open.bigmodel.cn/api/paas/v4"
  }
}'
```

### 自定义 API 端点

```python
agent = dslighting.Agent(
    model="custom-model",
    api_base="https://your-endpoint.com/v1",
    api_key="your-api-key",
    temperature=0.7,
    max_iterations=5
)
```

## 9. 常见问题

### Q: DSLighting 会自动读取 .env 文件吗？
**A:** 是的！DSLighting 会自动查找并读取项目根目录下的 `.env` 文件，无需安装 `python-dotenv` 或额外配置。

### Q: 如何获取 API 密钥？
- **OpenAI**: https://platform.openai.com/api-keys
- **智谱 AI**: https://open.bigmodel.cn/usercenter/apikeys
- **SiliconFlow**: https://cloud.siliconflow.cn/account/ak

### Q: 支持哪些模型？
任何兼容 OpenAI API 格式的模型都支持，包括：
- GPT-4, GPT-3.5-turbo
- DeepSeek-V3
- Qwen 系列
- GLM-4
- Kimi
- 等等

### Q: 如何调整 Agent 行为？
- 降低 `temperature` 使输出更稳定
- 增加 `max_iterations` 进行更深入的分析
- 设置 `keep_workspace=True` 保留中间结果用于调试

## 10. 完整示例

### 示例 1：使用内置任务（推荐新手）

```python
# quickstart_builtin.py
import dslighting

def main():
    agent = dslighting.Agent(
        workflow="aide",
        model="glm-4",
        temperature=0.7,
        max_iterations=5,
        keep_workspace=True
    )

    result = agent.run(task_id="bike-sharing-demand")
    print(f"✅ 任务完成！结果: {result}")

if __name__ == "__main__":
    main()
```

运行：
```bash
pip install dslighting
# 创建 .env 文件（参考步骤 3）
python quickstart_builtin.py
```

### 示例 2：使用自定义竞赛数据

```python
# quickstart_custom.py
import dslighting

def main():
    # 配置 mle-bench 格式路径
    DATA_PATH = "/path/to/dslighting/data/competitions/bike-sharing-demand"
    REGISTRY_PATH = "/path/to/dslighting/benchmarks/mlebench/competitions"

    # 加载竞赛数据
    data = dslighting.load_data(
        DATA_PATH,
        registry_dir=REGISTRY_PATH
    )

    # 创建并运行 Agent
    agent = dslighting.Agent(
        workflow="aide",
        model="glm-4",
        max_iterations=5
    )

    result = agent.run(data)
    print(f"✅ 任务完成！结果: {result}")

if __name__ == "__main__":
    main()
```

运行：
```bash
pip install dslighting
# 创建 .env 文件（参考步骤 3）
# 确保数据路径正确指向 mle-bench 格式目录
python quickstart_custom.py
```

**注意事项:**
- 确保数据路径符合 mle-bench 标准格式
- `DATA_PATH` 指向具体竞赛目录（如 `bike-sharing-demand`）
- `REGISTRY_PATH` 指向竞赛注册目录的父目录
- DSLighitng 会自动根据竞赛名称匹配配置文件

就这么简单！🚀

## 下一步

现在您已经了解了基本流程，可以继续探索：

- **[核心概念](./core-concepts)**: 深入了解 `dslighting` 的设计哲学和架构。
- **[Python API 参考](./python-api)**: 查看 `dslighting` API 的详细文档。
- **[命令行工具 (CLI)](./cli)**: 学习如何使用命令行工具。
