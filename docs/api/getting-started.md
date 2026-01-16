# 快速上手

欢迎使用 `dslighting`！本指南将引导您在 5 分钟内安装、配置并成功运行您的第一个数据科学任务。

## 1. 创建 Python 环境

首先，创建一个独立的 Python 环境（推荐使用 `venv` 或 `conda`）：

```bash
# 使用 venv 创建虚拟环境
python -m venv dslighting-env
source dslighting-env/bin/activate  # Linux/Mac
# 或
dslighting-env\Scripts\activate  # Windows
```

## 2. 安装 dslighting

确保您拥有 Python 3.9+ 环境，然后通过 `pip` 安装 `dslighting`：

```bash
pip install dslighting
```

## 3. 配置环境变量

创建一个 `.env` 文件来配置您的 LLM API 密钥和模型参数：

### .env 文件示例

创建 `.env` 文件并填入以下内容：

```bash
# .env

# LLM 模型配置（JSON 格式）
LLM_MODEL_CONFIGS='{
  "gpt-4o": {
    "api_key": "sk-your-openai-api-key",
    "api_base": "https://api.openai.com/v1",
    "temperature": 0.7
  },

  "glm-4": {
    "provider": "openai",
    "api_key": "your-zhipu-api-key-here",
    "api_base": "https://open.bigmodel.cn/api/paas/v4",
    "temperature": 1.0
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

  "openai/custom-model-name": {
    "api_key": "your-custom-api-key",
    "api_base": "https://your-custom-endpoint.com/v1",
    "temperature": 1.0
  }
}'

# 默认使用的模型（可选）
DEFAULT_MODEL="gpt-4o"

# Registry 目录（用于存储任务结果）
REGISTRY_DIR="./registry"
```

**配置说明:**

- **`LLM_MODEL_CONFIGS`**: JSON 格式的模型配置
  - 支持多个模型配置
  - `api_key`: 可以是单个字符串或字符串数组（轮询使用）
  - `api_base`: API 端点地址
  - `temperature`: 模型温度参数（0.0-2.0）

- **支持的模型提供商**:
  - OpenAI (GPT-4, GPT-3.5)
  - 智谱 AI (GLM-4)
  - SiliconFlow (DeepSeek, Qwen, Kimi 等)
  - 任何兼容 OpenAI API 的服务

## 4. 编写运行脚本

创建一个名为 `run.py` 的 Python 文件：

```python
# run.py
import os
import dslighting
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

def main():
    # 1. 创建 Agent 实例
    agent = dslighting.Agent(
        workflow="aide",                                    # 使用 aide 工作流
        model="openai/deepseek-ai/DeepSeek-V3",            # 指定模型
        temperature=0.7,                                    # 温度参数
        max_iterations=5,                                   # 最大迭代次数
        keep_workspace=True                                # 保留工作空间
    )

    # 2. 加载任务（使用内置的 bike-sharing-demand 示例）
    task_id = "bike-sharing-demand"

    # 3. 运行任务
    result = agent.run(task_id=task_id)

    # 4. 查看结果
    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
```

**API 参数说明:**

- **`workflow`**: 工作流类型
  - `"aide"`: AI 驱动的探索工作流（推荐用于数据分析）
  - `"automind"`: 自动化机器学习工作流
  - `"dsagent"`: 数据科学智能体工作流

- **`model`**: 使用的模型名称
  - 必须与 `.env` 中 `LLM_MODEL_CONFIGS` 定义的模型名称匹配
  - 例如: `"gpt-4o"`, `"openai/deepseek-ai/DeepSeek-V3"` 等

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

- **`task_id`**: 任务标识符
  - 使用内置任务: `"bike-sharing-demand"`, `"titanic"` 等
  - 或使用自定义数据集路径

## 5. 安装依赖

如果使用了 `.env` 文件，需要安装 `python-dotenv`：

```bash
pip install python-dotenv
```

## 6. 运行脚本

在终端中运行此脚本：

```bash
python run.py
```

## 7. 查看结果

脚本运行后，`dslighting` 会在 `REGISTRY_DIR` 指定的目录（默认为 `./registry`）下创建输出文件：

```
registry/
├── tasks/                # 任务记录
│   └── bike-sharing-demand/
│       └── 1/            # 运行实例 ID
│           ├── input/    # 输入数据
│           ├── artifacts/ # 生成的结果
│           │   ├── eda_report.md
│           │   └── analysis_results.json
│           ├── snapshot/ # 运行快照
│           └── task.log  # 任务日志
└── workspace/            # 工作空间（如果 keep_workspace=True）
```

- **`task.log`**: 包含完整的运行日志
- **`artifacts/`**: Agent 生成的分析结果和报告
- **`workspace/`**: 中间文件和工作数据（如果启用了 `keep_workspace`）

## 8. 使用自定义数据集

如果你想使用自己的数据集：

```python
import dslighting
from dotenv import load_dotenv

load_dotenv()

# 创建 Agent
agent = dslighting.Agent(
    workflow="aide",
    model="gpt-4o",
    temperature=0.7,
    max_iterations=5
)

# 使用自定义数据集路径
result = agent.run(
    task_id="my-custom-task",       # 自定义任务 ID
    data_path="path/to/your/data.csv"  # 你的数据文件路径
)

print(f"结果: {result}")
```

## 9. 高级配置

### 使用多个 API 密钥（轮询）

```python
# .env 中配置多个密钥
LLM_MODEL_CONFIGS='{
  "gpt-4o": {
    "api_key": [
      "sk-key-1",
      "sk-key-2",
      "sk-key-3"
    ],
    "api_base": "https://api.openai.com/v1"
  }
}'
```

DSLighting 会自动轮询使用这些密钥，实现负载均衡。

### 自定义 API 端点

```python
agent = dslighting.Agent(
    workflow="aide",
    model="custom-model",              # 自定义模型名称
    api_base="https://your-endpoint.com/v1",  # 自定义端点
    api_key="your-api-key",            # 自定义密钥
    temperature=0.7,
    max_iterations=5
)
```

## 常见问题

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

## 下一步

现在您已经了解了基本流程，可以继续探索：

- **[核心概念](./core-concepts)**: 深入了解 `dslighting` 的设计哲学和架构。
- **[Python API 参考](./python-api)**: 查看 `dslighting` API 的详细文档。
- **[命令行工具 (CLI)](./cli)**: 学习如何使用命令行工具。

## 完整示例

将所有步骤整合在一起：

```python
import dslighting
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

def main():
    # 创建 Agent
    agent = dslighting.Agent(
        workflow="aide",
        model="gpt-4o",
        temperature=0.7,
        max_iterations=5,
        keep_workspace=True
    )

    # 运行任务
    result = agent.run(task_id="bike-sharing-demand")

    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
```

保存为 `quickstart.py` 并运行：

```bash
# 安装依赖
pip install dslighting python-dotenv

# 配置 .env 文件（参考上面的示例）

# 运行
python quickstart.py
```

就这么简单！🚀
