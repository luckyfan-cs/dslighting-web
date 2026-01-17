# 数据系统

DSLighting 的数据系统是其核心基础设施，负责统一管理数据集、任务配置和元数据。理解数据系统的工作原理，将帮助您更有效地组织和运行数据科学任务。

## 目录

- [4.1 核心数据流](#41-核心数据流)
- [4.2 设计原则](#42-设计原则)
- [4.3 核心组件](#43-核心组件)
- [4.4 文件系统规范](#44-文件系统规范)
- [4.5 使用示例](#45-使用示例)
- [4.6 最佳实践](#46-最佳实践)

---

## 4.1 核心数据流

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

---

## 4.2 设计原则

| 原则 | 说明 |
|------|------|
| **单一数据源** | `LoadedData` 是数据的唯一入口，所有信息通过它访问 |
| **自动识别** | 系统自动检测任务类型，无需手动指定 |
| **路径明确** | v1.8.0+ 要求完整路径或预配置父目录，无歧义 |
| **配置驱动** | `config.yaml` 定义任务行为和评分方式 |

---

## 4.3 核心组件

### 4.3.1 LoadedData - 数据对象

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

---

### 4.3.2 TaskDetection - 任务类型识别

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

---

### 4.3.3 Registry - 注册配置

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

---

### 4.3.4 DataLoader - 数据加载器

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

---

## 4.4 文件系统规范

### 4.4.1 数据目录结构

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

### 4.4.2 注册目录结构

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

---

## 4.5 使用示例

### 4.5.1 基础使用

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

### 4.5.2 访问数据文件

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

### 4.5.3 获取配置信息

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

### 4.5.4 不同任务类型的处理

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

---

## 4.6 最佳实践

### 4.6.1 路径配置（v1.8.0+）

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

### 4.6.2 数据检查流程

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

### 4.6.3 错误处理

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

---

## 相关文档

- **[核心概念](./core-concepts)**: 了解 DSLighting 的整体架构设计
- **[快速上手](./getting-started)**: 学习如何使用数据系统运行任务
- **[Python API 参考](./python-api)**: 查看完整的 API 文档
