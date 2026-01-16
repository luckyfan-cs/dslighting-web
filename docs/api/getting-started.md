# 快速上手

欢迎使用 `dslighting`！本指南将引导您在 5 分钟内安装并成功运行您的第一个数据科学任务。

我们将从最简单的示例开始：使用 `dslighting` API 加载数据并运行一个 Agent 任务。

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

## 3. 创建数据文件

准备一个 CSV 格式的数据集文件（例如 `data.csv`）。如果没有数据集，可以使用 dslighting 的内置 mock 数据：

```python
import dslighting

# 使用内置的 mock 数据
DATA_PATH = dslighting.mock.train_csv  # 虚拟训练数据路径
REGISTRY_DIR = "./registry"  # registry 目录路径
MODEL = "gpt-4"  # 或其他支持的 LLM 模型
```

## 4. 编写运行脚本

创建一个名为 `run.py` 的 Python 文件：

```python
import dslighting

# 配置参数
DATA_PATH = "path/to/your/data.csv"  # 替换为你的数据路径
REGISTRY_DIR = "./registry"           # registry 目录
MODEL = "gpt-4"                        # 使用的模型

if __name__ == "__main__":
    # 1. 加载数据
    data = dslighting.load_data(
        DATA_PATH,
        registry_dir=REGISTRY_DIR
    )

    # 2. 创建 Agent
    agent = dslighting.Agent(
        model=MODEL,
        max_iterations=2
    )

    # 3. 运行任务
    result = agent.run(data)

    # 4. 查看结果
    print("Task completed!")
    print(f"Result: {result}")
```

**API 说明:**

- **`dslighting.load_data()`**: 加载数据集
  - `DATA_PATH`: 数据文件的路径
  - `registry_dir`: registry 目录，用于存储中间结果和配置

- **`dslighting.Agent`**: 创建一个 Agent 实例
  - `model`: 使用的 LLM 模型（如 `gpt-4`, `gpt-3.5-turbo` 等）
  - `max_iterations`: Agent 最大迭代次数

- **`agent.run()`**: 运行 Agent 任务
  - `data`: 加载的数据对象
  - 返回任务执行结果

## 5. 运行脚本

在终端中运行此脚本：

```bash
python run.py
```

## 6. 配置 API 密钥

在使用 LLM 模型前，需要配置相应的 API 密钥：

```bash
# 设置 OpenAI API Key
export OPENAI_API_KEY="sk-..."
```

或在代码中配置：

```python
import dslighting

# 配置 API 密钥
dslighting.configure(
    openai_api_key="sk-..."
)

# 然后运行任务
data = dslighting.load_data(DATA_PATH, registry_dir=REGISTRY_DIR)
agent = dslighting.Agent(model=MODEL)
result = agent.run(data)
```

## 7. 查看结果

脚本运行后，`dslighting` 会在当前目录下创建输出目录。其结构如下：

```
registry/
├── tasks/          # 任务记录
├── artifacts/      # 生成的工件
└── logs/          # 运行日志
```

- **`logs/`**: 包含完整的运行日志
- **`artifacts/`**: Agent 生成的分析结果和报告
- **`tasks/`**: 任务执行历史记录

恭喜！您已经成功运行了第一个 `dslighting` 任务。

## 下一步

现在您已经了解了基本流程，可以继续探索：

- **[核心概念](./core-concepts)**: 深入了解 `dslighting` 的设计哲学和架构。
- **[教程：创建自定义 Agent](./tutorials/custom-agent)**: 学习如何创建和定制自己的 Agent。
- **[Python API 参考](./python-api)**: 查看 `dslighting` API 的详细文档。

## 完整示例

将所有步骤整合在一起，一个完整的快速开始示例如下：

```python
import dslighting

# 配置
DATA_PATH = "data.csv"          # 你的数据文件
REGISTRY_DIR = "./registry"     # registry 目录
MODEL = "gpt-4"                 # 使用的模型

def main():
    # 配置 API 密钥（可选，也可以通过环境变量设置）
    dslighting.configure(
        openai_api_key="your-api-key"
    )

    # 加载数据
    data = dslighting.load_data(
        DATA_PATH,
        registry_dir=REGISTRY_DIR
    )

    # 创建 Agent
    agent = dslighting.Agent(
        model=MODEL,
        max_iterations=2
    )

    # 运行任务
    result = agent.run(data)

    print(f"✅ Task completed! Result: {result}")

if __name__ == "__main__":
    main()
```

保存为 `quickstart.py` 并运行：

```bash
pip install dslighting
python quickstart.py
```

就这么简单！🚀
