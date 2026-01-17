# 核心概念

`dslighting` 的设计旨在提供一个清晰、可复现且可扩展的框架来执行复杂的数据科学任务。理解以下几个核心概念，将帮助您更有效地使用本系统。

## 1. 声明式任务流：Benchmark, Task, 与 Workflow

`dslighting` 的核心是声明式的任务流。您通过 YAML 文件定义 **"做什么"**，而由 `dslighting` 的工作流引擎和 Agent 来决定 **"如何做"**。

### Benchmark (基准测试)

`Benchmark` 是最高层级的概念，它是一个或多个相关 `Task` 的集合。通常，一个 `benchmark.yml` 文件就定义了一个 `Benchmark`。

- **作用**: 将一个完整的数据科学项目（例如，"预测共享单车需求"）组织在一起。
- **配置**: `name`, `version`, `tasks` 列表等。

```yaml
# benchmark.yml
name: bike-sharing-demand-benchmark
version: '1.0'
tasks:
  - id: eda-task
    # ...
  - id: feature-engineering-task
    # ...
  - id: training-task
    # ...
```

### Task (任务)

`Task` 是一个独立、可执行的工作单元。每个 `Task` 都有一个明确的目标（`intent`）。

- **作用**: 定义项目中的一个具体步骤，例如"执行探索性数据分析"或"训练一个 LightGBM 模型"。
- **配置**: `id`, `workflow`, `data`, `intent` 等。

```yaml
# benchmark.yml
tasks:
  - id: eda-task
    workflow: aide
    intent: "Perform an exploratory data analysis."
    data:
      train_path: "path/to/train.csv"
```

### Workflow (工作流) / Agent (智能体)

`Workflow` (或称 `Agent`) 是执行 `Task` 的"大脑"。它负责解释 `Task` 的 `intent`，并执行一系列操作来完成该目标。

- **作用**: 实现具体的任务逻辑。`dslighting` 内置了多种 `Workflow`，例如：
    - **`aide`**: 一个通用的 AI 助教，擅长执行开放性的分析任务，如 EDA。
    - **`automind`**: 专注于自动化机器学习（AutoML）流程。
- **可扩展性**: 您可以轻松创建自己的 `Workflow` 来实现特定领域的逻辑。

---

## 2. 分层配置 (Layered Configuration)

`dslighting` 提供了一套灵活的配置系统，允许您在不同层级上进行设置。配置的优先级如下（从高到低）：

1.  **`dslighting.configure()` 函数**: 在 Python 代码中动态设置，拥有最高优先级。非常适合用于传递 API 密钥等敏感信息。
    ```python
    dslighting.configure(openai_api_key="sk-...")
    ```
2.  **`config.yml` 文件**: 在项目根目录下的配置文件，用于设置项目级的默认值。
3.  **环境变量**: 例如 `OPENAI_API_KEY`。
4.  **`benchmark.yml` 内部**: 在 `Task` 级别设置的参数，优先级最低。

---

## 3. 可复现的输出 (Reproducible Outputs)

可复现性是 `dslighting` 的核心设计目标之一。每次运行 `dslighting.run()`，都会在 `output` 目录下生成一个唯一的、包含时间戳的文件夹，用于存放本次运行的所有信息。

一个典型的输出目录结构如下：

```
output/
└── <benchmark_name>/
    └── <run_id>/
        ├── benchmark.yml         # 本次运行的 Benchmark 配置快照
        ├── dslighting.log        # 本次运行的详细日志
        ├── config.yml            # 配置快照
        └── <task_id>/            # 任务专属文件夹
            ├── input/            # 输入数据（或其引用）
            ├── snapshot/         # Agent 执行时生成的代码和环境快照
            └── artifacts/        # 任务产出的最终结果（如报告、模型文件等）
```

这种结构确保了：

- **完整追踪**: 从配置到代码再到结果，所有信息都被完整记录。
- **轻松复现**: 拿着这个输出目录，任何人都可以复现您的工作。
- **清晰隔离**: 不同次运行、不同任务之间的产物被清晰地分离开，互不干扰。

---

## 下一步

现在您已经了解了 DSLighting 的核心概念，可以继续探索：

- **[数据系统](./data-system)**: 深入了解 DSLighting 的数据管理系统、核心组件和最佳实践。
- **[快速上手](./getting-started)**: 学习如何安装和运行您的第一个任务。
- **[Python API 参考](./python-api)**: 查看 DSLighting API 的详细文档。
