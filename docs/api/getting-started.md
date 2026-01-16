# 快速上手

欢迎使用 `dslighting`！本指南将引导您在 5 分钟内安装、配置并成功运行您的第一个数据科学任务。

我们将以一个最简单的示例开始：使用 `dslighting` 在一个虚拟数据集上运行一次探索性数据分析 (EDA)。

## 1. 安装

首先，请确保您拥有 Python 3.9+ 环境。然后，在您的终端中通过 `pip` 安装 `dslighting`：

```bash
pip install dslighting
```

## 2. 创建任务配置文件

`dslighting` 使用 YAML 文件来定义任务流程。创建一个名为 `benchmark.yml` 的文件，并填入以下内容：

```yaml
# benchmark.yml
name: hello-dslighting-benchmark
version: '1.0'

# 定义一个简单的任务：执行 EDA
tasks:
  - id: hello-eda
    # 使用 aide 工作流
    workflow: aide
    # 定义输入数据（这里我们使用一个内置的虚拟数据集）
    data:
      train_path: dslighting.mock.train_csv
      test_path: dslighting.mock.test_csv
    # Agent 的目标
    intent: "Please perform an exploratory data analysis on the provided dataset."
```

**说明:**
- **`name`**: 定义了基准测试的名称。
- **`tasks`**: 一个任务列表，这里我们只定义了一个任务 `hello-eda`。
- **`workflow`**: 指定执行此任务的 Agent 工作流，我们使用内置的 `aide`。
- **`data`**: 定义输入数据。`dslighting` 提供了一个 `mock` 模块用于快速测试，无需准备真实数据。
- **`intent`**: 你希望 Agent 完成的目标。

## 3. 创建并运行 Python 脚本

现在，创建一个名为 `run.py` 的 Python 文件，用于加载并执行我们刚刚定义的任务。

```python
# run.py
import dslighting

if __name__ == "__main__":
    # 设置你的 LLM API 密钥
    # dslighting.configure(openai_api_key="sk-...")

    # 运行在 benchmark.yml 中定义的任务
    dslighting.run("benchmark.yml")
```

**说明:**
- **`dslighting.configure(...)`**: （可选）如果您的 LLM key 没有配置在环境变量中，可以在代码中进行配置。
- **`dslighting.run(...)`**: 这是 `dslighting` 的核心函数，它会读取 `benchmark.yml` 文件，并依次执行其中定义的所有任务。

在终端中运行此脚本：

```bash
python run.py
```

## 4. 查看结果

脚本运行后，`dslighting` 会在当前目录下创建一个 `output` 文件夹。其结构如下：

```
output/
└── hello-dslighting-benchmark/
    └── 1/  # 运行实例 ID
        ├── benchmark.yml
        ├── dslighting.log
        └── hello-eda/
            ├── input/
            ├── artifacts/
            │   └── eda_report.md
            └── snapshot/
```

- **`dslighting.log`**: 本次运行的完整日志。
- **`hello-eda/artifacts/eda_report.md`**: `aide` Agent 生成的探索性数据分析报告。

恭喜！您已经成功运行了第一个 `dslighting` 任务。

## 下一步

现在您已经了解了基本流程，可以继续探索：

- **[核心概念](./core-concepts)**: 深入了解 `dslighting` 的设计哲学。
- **[教程：运行你的第一个基准测试](./tutorials/first-benchmark)**: 学习如何使用真实数据运行一个完整的机器学习基准测试。
- **[Python API 参考](./python-api)**: 查看 `dslighting.run()` 和其他函数的详细用法。
