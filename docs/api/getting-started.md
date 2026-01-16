# 快速上手

欢迎使用 `dslighting`！本指南将引导您在 5 分钟内安装、配置并成功运行您的第一个数据科学任务。

## 1. 创建 Python 环境

首先，创建一个独立的 Python 环境（推荐使用 venv 或 conda）：

### 方式 1：使用 venv（推荐）

**Linux / macOS:**
```bash
# 使用 venv 创建虚拟环境（需要 Python 3.10+）
python3.10 -m venv dslighting-env
source dslighting-env/bin/activate
```

**Windows:**
```bash
# 使用 venv 创建虚拟环境（需要 Python 3.10+）
python3.10 -m venv dslighting-env
dslighting-env\Scripts\activate
```

---

### 方式 2：使用 Conda

**Linux / macOS / Windows:**
```bash
# 创建一个新的 conda 环境
conda create -n dslighting-env python=3.10

# 激活环境
conda activate dslighting-env  # Linux/macOS
# 或
conda activate dslighting-env  # Windows
```

---

**系统要求:**
- Python 3.10 或更高版本
- 推荐使用 Python 3.10 或 3.11

**推荐工具:**
- **新手**: Conda（更简单，跨平台一致）
- **有经验**: venv（Python 内置，更轻量）

## 2. 安装 dslighting

通过 `pip` 安装必要的依赖：

```bash
pip install dslighting python-dotenv
```

**依赖说明：**
- `dslighting`: DSLighting 核心包
- `python-dotenv`: 用于加载 `.env` 配置文件

## 3. 配置环境变量

创建 `.env` 文件来配置 LLM API 密钥和模型参数。

### .env 文件示例

在项目根目录创建 `.env` 文件：

```bash
# .env

# 指定默认使用的模型（必须设置！）
LLM_MODEL=glm-4

# 多模型配置（JSON 格式）
LLM_MODEL_CONFIGS='{
  "glm-4": {
    "api_key": ["your-key-1", "your-key-2"],
    "api_base": "https://open.bigmodel.cn/api/paas/v4",
    "temperature": 0.7,
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

- **`LLM_MODEL`**: 默认使用的模型名称（**必须设置！**）
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

### ✅ 方式 1：使用默认模型

使用 `.env` 文件中配置的默认模型（`LLM_MODEL`）：

```python
# run.py
from dotenv import load_dotenv
load_dotenv()  # 必须有！加载 .env 文件

import dslighting

def main():
    # 不指定 model，自动使用 LLM_MODEL 环境变量
    agent = dslighting.Agent()

    result = agent.run(
        task_id="bike-sharing-demand",
        data_dir="/path/to/dslighting/data/competitions"
    )

    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
```

---

### 方式 2：运行时指定模型

在创建 Agent 时明确指定使用哪个模型：

```python
# run.py
from dotenv import load_dotenv
load_dotenv()  # 必须有！加载 .env 文件

import dslighting

def main():
    # 明确指定使用哪个模型
    agent = dslighting.Agent(
        model="openai/deepseek-ai/DeepSeek-V3",
        temperature=0.7,
        max_iterations=5
    )

    result = agent.run(
        task_id="bike-sharing-demand",
        data_dir="/path/to/dslighting/data/competitions"
    )

    print(f"✅ 任务完成！")
    print(f"结果: {result}")

if __name__ == "__main__":
    main()
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

### Q: 为什么要使用 `load_dotenv()`？
**A:** DSLighting 需要 `load_dotenv()` 来加载 `.env` 文件中的配置。必须在导入 `dslighting` 之前调用。

### Q: `LLM_MODEL` 必须设置吗？
**A:** 是的！`.env` 文件中必须设置 `LLM_MODEL`，指定默认使用的模型。

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

### Q: 为什么显示 "Score: N/A"？
**A:** 这是 DSLighting 的一个已知问题：自动评分功能当前未启用。

**原因分析:**
- Agent 执行正常
- 提交文件生成成功
- 但自动评分代码未被调用（`self.benchmark` 始终为 `None`）
- 导致返回 `Score: N/A` 而不是实际分数

**临时解决方案 - 手动评分:**

```python
# run_with_manual_grade.py
from dotenv import load_dotenv
load_dotenv()

import dslighting
from pathlib import Path
from mlebench.grade import grade_csv
from dsat.benchmark.mle import MLEBenchmarkRegistry

def main():
    # 1. 运行 Agent
    info = dslighting.datasets.load_bike_sharing_demand()
    agent = dslighting.Agent(model="glm-4")

    result = agent.run(
        task_id="bike-sharing-demand",
        data_dir=str(info['data_dir'].parent)
    )

    print(f"✅ 任务完成")
    print(f"✅ Workspace: {result.workspace_path}")
    print(f"✅ Score: {result.score}")  # None，因为自动评分未运行

    # 2. 手动评分
    # 获取内置注册表路径
    registry_dir = Path(dslighting.__file__).parent / "registry"
    registry = MLEBenchmarkRegistry(registry_dir=str(registry_dir))

    # 获取竞赛
    competition = registry.get_competition("bike-sharing-demand")

    # 找到提交文件
    submission_files = list(result.workspace_path.glob("sandbox/submission_*.csv"))
    if submission_files:
        submission_path = submission_files[0]
        print(f"\n📊 提交文件: {submission_path}")

        # 手动评分
        report = grade_csv(submission_path, competition)
        print(f"✅ 手动评分完成")
        print(f"✅ 实际 Score: {report.score}")
        print(f"✅ 评分方式: {'越低越好' if report.is_lower_better else '越高越好'}")
    else:
        print("❌ 未找到提交文件")

if __name__ == "__main__":
    main()
```

**说明:**
- Agent 会正常运行并生成提交文件
- 使用上述代码可以手动获取实际分数
- 这不是配置问题，而是 DSLighting 的待修复 bug

**长期解决:**
等待 DSLighting 官方修复并启用自动评分功能。

## 10. 完整示例

### 示例 1：使用默认模型（推荐）

```python
# quickstart_builtin.py
from dotenv import load_dotenv
load_dotenv()  # 必须有！加载 .env 文件

import dslighting

def main():
    # 使用 .env 中的 LLM_MODEL
    agent = dslighting.Agent(
        workflow="aide",
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
pip install dslighting python-dotenv
# 创建 .env 文件并设置 LLM_MODEL（参考步骤 3）
python quickstart_builtin.py
```

### 示例 2：使用指定模型

```python
# quickstart_custom_model.py
from dotenv import load_dotenv
load_dotenv()  # 必须有！加载 .env 文件

import dslighting

def main():
    # 明确指定模型
    agent = dslighting.Agent(
        workflow="aide",
        model="openai/deepseek-ai/DeepSeek-V3",  # 指定模型
        temperature=0.7,
        max_iterations=5
    )

    result = agent.run(task_id="bike-sharing-demand")
    print(f"✅ 任务完成！结果: {result}")

if __name__ == "__main__":
    main()
```

运行：
```bash
pip install dslighting python-dotenv
# 创建 .env 文件并配置模型（参考步骤 3）
python quickstart_custom_model.py
```

就这么简单！🚀

## 下一步

现在您已经了解了基本流程，可以继续探索：

- **[核心概念](./core-concepts)**: 深入了解 `dslighting` 的设计哲学和架构。
- **[Python API 参考](./python-api)**: 查看 `dslighting` API 的详细文档。
- **[命令行工具 (CLI)](./cli)**: 学习如何使用命令行工具。
