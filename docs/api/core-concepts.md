# 核心概念

`dslighting` 的设计旨在提供一个清晰、可复现且可扩展的框架来执行复杂的数据科学任务。理解以下几个核心概念，将帮助您更有效地使用本系统。

## 目录

- [1. 声明式任务流](#1-声明式任务流benchmark-task-与-workflow)
- [2. 分层配置](#2-分层配置-layered-configuration)
- [3. 可复现的输出](#3-可复现的输出-reproducible-outputs)
- [4. 数据系统](#4-数据系统)
  - [4.1 核心数据流](#41-核心数据流)
  - [4.2 设计原则](#42-设计原则)
  - [4.3 核心组件](#43-核心组件)
  - [4.4 文件系统规范](#44-文件系统规范)
  - [4.5 使用示例](#45-使用示例)
  - [4.6 最佳实践](#46-最佳实践)

---

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

## 4. 数据系统

DSLighting 的数据系统是其核心基础设施，负责统一管理数据集、任务配置和元数据。理解数据系统的工作原理，将帮助您更有效地组织和运行数据科学任务。

### 4.1 核心数据流

```
原始文件系统
    │
    ├── 数据目录 (data/competitions/my-task/)
    │   └── prepared/
    │       ├── public/    → 训练数据
    │       └── private/   → 测试答案
    │
    ├── 注册目录 (registry/my-task/)
    │   ├── config.yaml    → 任务配置
    │   ├── description.md → 任务描述
    │   └── grade.py       → 评分脚本
    │
    ▼
LoadedData 对象 (统一封装)
    │
    ├── 基础属性
    │   ├── task_id
    │   ├── data_dir
    │   └── registry_dir
    │
    ├── 任务识别 (TaskDetection)
    │   ├── task_type (kaggle/open_ended/datasci)
    │   └── metadata
    │
    └── 注册配置 (Registry)
        ├── config (config.yaml 内容)
        ├── description (description.md 内容)
        └── grader (评分器)
    │
    ▼
Agent 消费
    ├── 显示摘要: data.show()
    ├── 获取信息: data.get_description()
    └── 执行任务: agent.run(data)
```

**数据流说明：**

1. **文件系统层**: 原始数据和配置文件存储在磁盘上
2. **数据加载层**: `DataLoader` 从文件系统读取数据，创建 `LoadedData` 对象
3. **对象封装层**: `LoadedData` 统一封装所有数据相关的信息和操作
4. **任务执行层**: Agent 消费 `LoadedData` 对象，执行具体任务

### 4.2 设计原则

| 原则 | 说明 |
|------|------|
| **单一数据源** | `LoadedData` 是数据的唯一入口，所有信息通过它访问 |
| **自动识别** | 系统自动检测任务类型，无需手动指定 |
| **路径明确** | v1.8.0+ 要求完整路径或预配置父目录，无歧义 |
| **配置驱动** | `config.yaml` 定义任务行为和评分方式 |

### 4.3 核心组件

#### 4.3.1 LoadedData - 数据对象

`LoadedData` 是 DSLighting 的**核心数据容器**，它封装了：
- 数据集路径信息
- 任务元数据
- 任务类型识别结果
- 注册配置信息

**创建方式**：

```python
import dslighting

# 方式1：通过 load_data() 函数
data = dslighting.load_data(
    "/path/to/data/competitions/my-task",
    registry_dir="/path/to/registry/my-task"
)

# 方式2：Agent.run() 内部自动加载
agent = dslighting.Agent()
result = agent.run(task_id="my-task", data_dir="...", registry_dir="...")
```

**对象结构**：

```python
class LoadedData:
    """数据加载对象 - DSLighting 的核心数据容器"""

    # === 基础属性 ===
    task_id: str           # 任务ID（从路径提取）
    data_dir: Path         # 数据目录路径
    registry_dir: Path     # 注册目录路径

    # === 核心组件 ===
    task_detection: TaskDetection  # 任务类型识别对象
    registry: Registry            # 注册配置对象

    # === 数据路径属性 ===
    @property
    def public_dir(self) -> Path:      # prepared/public/ 目录
        pass

    @property
    def private_dir(self) -> Path:     # prepared/private/ 目录
        pass
```

**核心方法**：

```python
# 1. 显示数据摘要
summary = data.show()
# 返回: 多行字符串，包含任务ID、路径、文件列表等信息

# 2. 获取任务描述
description = data.get_description()
# 返回: description.md 的文本内容

# 3. 获取任务类型
task_type = data.get_task_type()
# 返回: "kaggle" | "open_ended" | "datasci"

# 4. 获取推荐工作流
workflow = data.get_recommended_workflow()
# 返回: 基于任务类型的工作流建议

# 5. 获取I/O指令
io_instructions = data.get_io_instructions()
# 返回: 输入输出格式说明
```

#### 4.3.2 TaskDetection - 任务类型识别

`TaskDetection` 负责自动识别任务类型，无需用户手动指定。

**任务类型**：

| 类型 | 识别标准 | 特点 |
|------|----------|------|
| `kaggle` | 有 `sampleSubmission.csv` | 竞赛类任务，需要提交预测文件 |
| `open_ended` | 无 `sampleSubmission.csv`，无标签列 | 开放式任务，无标准答案 |
| `datasci` | 无 `sampleSubmission.csv`，有标签列 | 数据科学任务，可直接评估 |

**对象结构**：

```python
class TaskDetection:
    """任务类型识别对象"""

    task_type: str  # "kaggle" | "open_ended" | "datasci"

    @property
    def is_kaggle(self) -> bool:
        """是否为 Kaggle 竞赛任务"""
        return self.task_type == "kaggle"

    @property
    def is_open_ended(self) -> bool:
        """是否为开放式任务"""
        return self.task_type == "open_ended"

    @property
    def is_datasci(self) -> bool:
        """是否为数据科学任务"""
        return self.task_type == "datasci"
```

**识别逻辑**：

```
开始
  │
  ├─ 检查 sampleSubmission.csv 是否存在
  │  ├─ 是 → kaggle 类型
  │  └─ 否 → 继续
  │
  ├─ 检查 train.csv 是否有标签列
  │  ├─ 是 → datasci 类型
  │  └─ 否 → open_ended 类型
  │
  ▼
返回 TaskDetection 对象
```

#### 4.3.3 Registry - 注册配置

`Registry` 负责加载和管理任务的注册配置，包括：
- `config.yaml` - 任务配置（必需）
- `description.md` - 任务描述（必需）
- `grade.py` - 自定义评分脚本（可选）

**对象结构**：

```python
class Registry:
    """注册配置对象"""

    # === 配置属性 ===
    config: dict          # config.yaml 的内容
    description: str      # description.md 的内容
    grader: Grader        # 评分器对象

    # === 核心方法 ===
    def get_metric(self) -> str:
        """获取评估指标（如 rmsle, accuracy）"""
        pass

    def get_awards_medals(self) -> bool:
        """是否颁发奖牌"""
        pass
```

**config.yaml 结构**：

```yaml
# === 基本信息 ===
id: my-task                    # 任务唯一ID
name: My Task                  # 任务显示名称
competition_type: simple       # 竞赛类型
awards_medals: false           # 是否颁发奖牌
description: my-task/description.md  # 任务描述文件路径

# === 数据集配置 ===
dataset:
  answers: my-task/prepared/private/test_answer.csv
  sample_submission: my-task/prepared/public/sampleSubmission.csv

# === 评分器配置 ===
grader:
  name: rmsle                  # 评估指标名称
  # 或使用自定义评分脚本
  # grade_path: my-task/grade.py
```

**评分器类型**：

| 评分器 | 适用场景 | 说明 |
|--------|----------|------|
| `accuracy` | 分类任务 | 准确率 |
| `rmsle` | 回归任务 | 均方根对数误差 |
| `f1` | 分类任务 | F1 分数 |
| `custom` | 自定义 | 使用 grade.py |

#### 4.3.4 DataLoader - 数据加载器

`DataLoader` 负责从文件系统加载数据并创建 `LoadedData` 对象。

**使用方式**：

```python
from dslighting.core.data import DataLoader

# 创建加载器
loader = DataLoader()

# 加载数据
data = loader.load(
    data_dir="/path/to/data/competitions/my-task",
    registry_dir="/path/to/registry/my-task"
)
```

**加载流程**：

```
1. 验证数据目录结构
   ├─ prepared/public/train.csv 是否存在
   └─ prepared/private/test_answer.csv 是否存在

2. 加载任务配置
   ├─ 读取 registry/config.yaml
   ├─ 读取 registry/description.md
   └─ 加载 registry/grade.py (如果存在)

3. 识别任务类型
   └─ 调用 TaskDetection 自动识别

4. 创建 LoadedData 对象
   └─ 返回统一的数据容器
```

### 4.4 文件系统规范

#### 4.4.1 数据目录结构

```
data/competitions/my-task/prepared/
├── public/                       # 公开数据
│   ├── train.csv                 # 训练集 (必需)
│   ├── test.csv                  # 测试集 (必需)
│   └── sampleSubmission.csv      # 提交样例 (kaggle类型必需)
│
└── private/                      # 私有数据
    └── test_answer.csv           # 测试答案 (必需)
```

**文件格式要求**：

| 文件 | 格式 | 要求 |
|------|------|------|
| `train.csv` | CSV | 第一列为ID列，最后一列为标签列 |
| `test.csv` | CSV | 第一列为ID列，无标签列 |
| `sampleSubmission.csv` | CSV | 包含ID和预测列，格式与提交格式一致 |
| `test_answer.csv` | CSV | 包含真实标签，用于评估 |

#### 4.4.2 注册目录结构

```
registry/my-task/
├── config.yaml          # 任务配置 (必需)
├── description.md       # 任务描述 (必需)
└── grade.py             # 自定义评分脚本 (可选)
```

**文件说明**：

**config.yaml** (必需):
- 定义任务ID、名称、类型
- 指定数据集路径
- 配置评分器

**description.md** (必需):
- 任务背景介绍
- 数据字段说明
- 评估标准说明

**grade.py** (可选):
- 自定义评分逻辑
- 当 `config.yaml` 中使用 `grade_path` 时需要

### 4.5 使用示例

#### 4.5.1 基础使用

```python
import dslighting

# 加载数据
data = dslighting.load_data(
    "/path/to/data/competitions/my-task",
    registry_dir="/path/to/registry/my-task"
)

# 查看摘要
print(data.show())

# 获取任务描述
print(data.get_description())

# 获取任务类型
print(f"Task Type: {data.get_task_type()}")
```

#### 4.5.2 访问数据文件

```python
import pandas as pd
from pathlib import Path

# 数据路径
train_path = data.data_dir / "prepared" / "public" / "train.csv"
test_path = data.data_dir / "prepared" / "public" / "test.csv"

# 读取数据
train_df = pd.read_csv(train_path)
test_df = pd.read_csv(test_path)

print(f"Train shape: {train_df.shape}")
print(f"Test shape: {test_df.shape}")
```

#### 4.5.3 获取配置信息

```python
# 获取评估指标
metric = data.registry.get_metric()
print(f"Evaluation Metric: {metric}")

# 获取任务描述
description = data.get_description()
print(description)

# 检查是否颁发奖牌
awards_medals = data.registry.get_awards_medals()
print(f"Awards Medals: {awards_medals}")
```

#### 4.5.4 不同任务类型的处理

```python
# Kaggle 类型
if data.task_detection.is_kaggle:
    print("This is a Kaggle competition task")
    print("Need to generate submission file")

# 开放式类型
elif data.task_detection.is_open_ended:
    print("This is an open-ended task")
    print("No standard answer available")

# 数据科学类型
elif data.task_detection.is_datasci:
    print("This is a data science task")
    print("Can evaluate directly")
```

### 4.6 最佳实践

#### 4.6.1 路径配置（v1.8.0+）

```python
# ✅ 推荐：使用全局配置（多任务项目）
import dslighting

dslighting.setup(
    data_parent_dir="/path/to/data/competitions",
    registry_parent_dir="/path/to/registry"
)

# 之后只需 task_id
data1 = dslighting.load_data("task-1")  # 使用配置的父目录
data2 = dslighting.load_data("task-2")
```

```python
# ✅ 推荐：使用完整路径（单任务）
import dslighting

data = dslighting.load_data(
    "/path/to/data/competitions/my-task",       # 完整路径
    registry_dir="/path/to/registry/my-task"     # 完整路径
)
```

#### 4.6.2 数据检查流程

```python
import dslighting

# 1. 加载数据
data = dslighting.load_data(
    "/path/to/data/competitions/my-task",
    registry_dir="/path/to/registry/my-task"
)

# 2. 检查摘要
print(data.show())

# 3. 确认任务类型
task_type = data.get_task_type()
print(f"Task Type: {task_type}")

# 4. 阅读任务描述
description = data.get_description()
print(description)

# 5. 运行任务
agent = dslighting.Agent()
result = agent.run(data)
```

#### 4.6.3 错误处理

```python
from pathlib import Path

# 检查数据目录是否存在
data_dir = Path("/path/to/data/competitions/my-task")
if not (data_dir / "prepared" / "public" / "train.csv").exists():
    raise ValueError("Invalid data directory structure")

# 检查注册目录是否存在
registry_dir = Path("/path/to/registry/my-task")
if not (registry_dir / "config.yaml").exists():
    raise ValueError("Registry config.yaml not found")

# 加载数据
data = dslighting.load_data(data_dir, registry_dir=registry_dir)
```

---

## API 快速参考

### 数据加载

| 函数 | 说明 |
|------|------|
| `load_data(source, registry_dir)` | 加载数据并返回 LoadedData 对象 |

### LoadedData 方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `show()` | str | 显示数据摘要 |
| `get_description()` | str | 获取任务描述 |
| `get_task_type()` | str | 获取任务类型 |
| `get_recommended_workflow()` | str | 获取推荐工作流 |
| `get_io_instructions()` | str | 获取I/O指令 |

### TaskDetection 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `task_type` | str | 任务类型 (kaggle/open_ended/datasci) |
| `is_kaggle` | bool | 是否为Kaggle任务 |
| `is_open_ended` | bool | 是否为开放式任务 |
| `is_datasci` | bool | 是否为数据科学任务 |

### Registry 方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `get_metric()` | str | 获取评估指标 |
| `get_awards_medals()` | bool | 是否颁发奖牌 |
