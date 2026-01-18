# Agent 参数完整指南

本文档提供所有 6 种 workflow 的独立参数详细说明，用于 DSLighting v1.9.0+ 版本。

## 目录

- [1. AIDE](#1-aide)
- [2. AutoKaggle](#2-autokaggle)
- [3. DataInterpreter](#3-datainterpreter)
- [4. AutoMind](#4-automind)
- [5. DS-Agent](#5-ds-agent)
- [6. DeepAnalyze](#6-deepanalyze)
- [7. 参数映射表](#7-参数映射表)
- [8. 公共参数](#8-公共参数)
- [9. 快速参考卡片](#9-快速参考卡片)

---

## 1. AIDE

### 基本信息

**英文名称**: AIDE (Adaptive Iteration and Debugging Enhancement)
**中文名称**: 自适应迭代与调试增强
**适用场景**: Kaggle 竞赛（简单到中等复杂度）
**配置路径**: `agent.search`

### 独立参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `num_drafts` | int | - | **已弃用**：在 AIDE 中不直接使用 |
| `debug_prob` | float | - | **已弃用**：在 AIDE 中不直接使用 |
| `max_debug_depth` | int | - | **已弃用**：在 AIDE 中不直接使用 |

**注意**: AIDE 实际使用的是 `agent.search.max_iterations`（公共参数），而不是上述嵌套参数。

### v1.9.0+ API 完整示例

```python
from dotenv import load_dotenv
load_dotenv()  # 从当前目录加载 .env 文件

import dslighting

# 加载数据
data = dslighting.load_data("/path/to/your/data")

# 创建 AIDE Agent
agent = dslighting.Agent(
    workflow="aide",
    model="gpt-4o",
    temperature=0.7,
    max_iterations=10,
)

# 运行 Agent
result = agent.run(data)

# 查看结果
print(f"Score: {result.score}")
print(f"Output: {result.output}")
print(f"Cost: ${result.cost:.2f}")
```

### 简化版本（推荐使用）

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="aide",
    model="gpt-4o",
    temperature=0.7,
    max_iterations=10,
)

result = agent.run(data)

print(f"Score: {result.score}")
```

### 源码位置

- **文件**: `dsat/workflows/search/aide_workflow.py`
- **行号**: 86
- **代码**: `max_iterations = self.agent_config.get("search", {}).get("max_iterations", 3)`

---

## 2. AutoKaggle

### 基本信息

**英文名称**: AutoKaggle
**中文名称**: 自动 Kaggle 竞赛助手
**适用场景**: Kaggle 竞赛（高复杂度）
**配置路径**: `agent.autokaggle`

### 独立参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `max_attempts_per_phase` | int | 5 | 每个阶段的最大重试次数。当某个阶段的代码执行失败或评分不达标时，会重试最多该次数。 |
| `success_threshold` | float | 3.0 | 评分阈值（1-5分）。当某个阶段的评审分数达到或超过此值时，进入下一阶段。 |

### v1.9.0+ API 完整示例

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="autokaggle",
    model="gpt-4o",
    temperature=0.5,

    autokaggle={
        "max_attempts_per_phase": 5,
        "success_threshold": 3.5
    }
)

result = agent.run(data)

print(f"Score: {result.score}")
print(f"Duration: {result.duration:.1f}s")
print(f"Cost: ${result.cost:.2f}")
```

### 参数详解

#### `max_attempts_per_phase`

**作用**: 控制每个动态阶段的容错性

**推荐值**:

| 场景 | 推荐值 | 说明 |
|------|--------|------|
| 快速测试 | 2-3 | 低成本，快速验证想法 |
| 标准配置 | 5 | 默认值，平衡性能和成本 |
| 高质量 | 8-10 | 适用于重要竞赛 |
| 极限性能 | 15+ | 追求最佳成绩 |

**示例**:

```python
# 低成本快速测试
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={"max_attempts_per_phase": 2}
)

# 标准配置（推荐）
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={"max_attempts_per_phase": 5}
)

# 高质量竞赛
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={"max_attempts_per_phase": 10}
)
```

#### `success_threshold`

**作用**: 控制每个阶段的质量门槛

**评分标准** (1-5分):

| 分数 | 代码质量 | 说明 |
|------|----------|------|
| 1-2分 | 差 | 代码有严重错误或逻辑问题 |
| 3分 | 合格 | 代码基本正确，但需要改进（默认） |
| 4分 | 良好 | 代码质量良好，有小问题 |
| 5分 | 完美 | 代码完美，无需改进 |

**推荐值**:

| 场景 | 推荐值 | 说明 |
|------|--------|------|
| 快速迭代 | 2.5-3.0 | 降低门槛，快速推进 |
| 标准配置 | 3.0-3.5 | 平衡质量和速度 |
| 高质量 | 4.0-4.5 | 严格标准，确保质量 |
| 极限性能 | 5.0 | 完美主义，追求极致 |

**示例**:

```python
# 宽松标准（快速）
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={"success_threshold": 2.5}
)

# 标准配置
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={"success_threshold": 3.0}
)

# 严格标准（高质量）
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={"success_threshold": 4.0}
)
```

### 重要说明

**AutoKaggle 的阶段是动态规划的**:

- `max_iterations` **不控制** AutoKaggle 的阶段数
- 阶段数由 LLM 根据任务复杂度动态规划
- 每个阶段会重试 `max_attempts_per_phase` 次，直到分数达到 `success_threshold`

### 源码位置

- **文件**: `dsat/workflows/manual/autokaggle_workflow.py`
- **行号**: 44-48
- **代码**:
  ```python
  sop_config = agent_config.get("autokaggle", {})
  self.config = {
      "max_attempts_per_phase": sop_config.get("max_attempts_per_phase", 5),
      "success_threshold": sop_config.get("success_threshold", 3.0)
  }
  ```

---

## 3. DataInterpreter

### 基本信息

**英文名称**: DataInterpreter
**中文名称**: 数据解释器
**适用场景**: 数据探索、分析、可视化
**配置路径**: `agent` (无独立配置段)

### 独立参数

**无独立参数**

DataInterpreter 没有独有的 workflow 参数，只使用公共参数。

### v1.9.0+ API 完整示例

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="data_interpreter",
    model="gpt-4o-mini",
    temperature=0.7,
    max_iterations=5,
)

result = agent.run(data)

print(f"Output: {result.output}")
print(f"Cost: ${result.cost:.2f}")
```

### 源码位置

- **文件**: `dsat/workflows/manual/data_interpreter_workflow.py`
- **行号**: 37
- **代码**: `self.max_retries = self.agent_config.get("max_retries", 3)`

---

## 4. AutoMind

### 基本信息

**英文名称**: AutoMind
**中文名称**: 自动机智
**适用场景**: 复杂规划、需要知识库的长期任务
**配置路径**: `workflow.params`

### 独立参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `case_dir` | str | - | 经验回放目录路径。用于保存和加载历史经验案例。 |
| `enable_rag` | bool | True | 是否启用 RAG（检索增强生成）。启用时会使用知识库检索相似历史经验。 |

### v1.9.0+ API 完整示例

#### 方法 1：基本用法（启用 RAG - 默认）

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="automind",
    model="gpt-4o",
    temperature=0.5,
    max_iterations=10,

    automind={
        "case_dir": "./experience_replay",
        "enable_rag": True  # 默认值，使用知识库检索
    }
)

result = agent.run(data)

print(f"Score: {result.score}")
print(f"Output: {result.output}")
print(f"Cost: ${result.cost:.2f}")
```

#### 方法 2：禁用 RAG（避免 HuggingFace 下载）

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="automind",
    model="gpt-4o",
    temperature=0.5,
    max_iterations=10,

    automind={
        "enable_rag": False  # 禁用知识库，不需要 HuggingFace
    }
)

result = agent.run(data)

print(f"Score: {result.score}")
print(f"Cost: ${result.cost:.2f}")
```

#### 方法 3：使用 DeepSeek 模型并禁用 RAG

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    model="openai/deepseek-ai/DeepSeek-V3",  # 或其他 DeepSeek 模型
    workflow="automind",
    automind={
        "enable_rag": False  # 禁用知识库检索
    }
)

result = agent.run(data)

print(f"Score: {result.score}")
print(f"Cost: ${result.cost:.2f}")
print(f"Output: {result.output}")
```

### 参数详解

#### `case_dir`

**作用**: 指定经验回放（Experience Replay）目录

**用途**:

- 保存成功案例供未来参考
- 使用向量数据库 (VDB) 检索相似历史经验
- 加速复杂任务的解决

**示例**:

```python
# 使用相对路径
agent = dslighting.Agent(
    workflow="automind",
    automind={"case_dir": "./experience_replay"}
)

# 使用绝对路径
agent = dslighting.Agent(
    workflow="automind",
    automind={"case_dir": "/path/to/experience_replay"}
)

# 不使用经验回放（不传此参数）
agent = dslighting.Agent(workflow="automind")  # case_dir 为可选
```

**目录结构** (会自动创建):

```
experience_replay/
├── cases/          # 历史案例
├── vectors/        # 向量索引
└── metadata.json   # 元数据
```

#### `enable_rag`

**作用**: 控制是否启用 RAG（检索增强生成）功能

**何时使用**:

| 场景 | 推荐设置 | 说明 |
|------|---------|------|
| 需要从历史经验中学习 | `enable_rag=True` | 使用向量数据库检索相似案例 |
| 避免 HuggingFace 下载 | `enable_rag=False` | 不使用知识库，避免网络问题 |
| 首次运行/无历史数据 | `enable_rag=False` | 没有历史案例时无需 RAG |
| 使用国产模型（DeepSeek等） | `enable_rag=False` | 避免依赖 HuggingFace |

**示例**:

```python
# 启用 RAG（默认）
agent = dslighting.Agent(
    workflow="automind",
    automind={"enable_rag": True}  # 需要安装 sentence-transformers
)

# 禁用 RAG
agent = dslighting.Agent(
    workflow="automind",
    automind={"enable_rag": False}  # 不需要额外依赖
)

# 配合 case_dir 使用
agent = dslighting.Agent(
    workflow="automind",
    automind={
        "case_dir": "./experience_replay",
        "enable_rag": True  # 从历史案例中检索
    }
)
```

**注意事项**:

- `enable_rag=True` 时，AutoMind 会使用 HuggingFace 的嵌入模型
- 如果网络无法访问 HuggingFace，建议设置 `enable_rag=False`
- 禁用 RAG 后，AutoMind 仍然会保存案例到 `case_dir`，但不会检索历史经验

### 源码位置

- **文件**: `dsat/workflows/search/automind_workflow.py`
- **行号**: 35-48
- **说明**: AutoMind 继承自 AIDE，增加了 VDB 服务和案例检索功能

---

## 5. DS-Agent

### 基本信息

**英文名称**: DS-Agent
**中文名称**: 数据科学 Agent
**适用场景**: 长期任务、需要持续规划和日志记录
**配置路径**: `workflow.params`

### 独立参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `case_dir` | str | - | 经验回放目录路径（与 AutoMind 类似）。 |

### v1.9.0+ API 完整示例

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="dsagent",
    model="gpt-4o",
    temperature=0.6,
    max_iterations=15,

    dsagent={
        "case_dir": "./experience_replay"
    }
)

result = agent.run(data)

print(f"Score: {result.score}")
print(f"Output: {result.output}")
print(f"Cost: ${result.cost:.2f}")
```

### 参数详解

#### `case_dir`

**作用**: 与 AutoMind 类似，用于经验回放

**特点**:

- DS-Agent 使用 Plan-Execute-Log 循环
- 每次迭代会记录日志到 `case_dir`
- 可以从历史案例中学习

**示例**:

```python
# 使用相对路径
agent = dslighting.Agent(
    workflow="dsagent",
    dsagent={"case_dir": "./dsa_experience"}
)

# 使用绝对路径
agent = dslighting.Agent(
    workflow="dsagent",
    dsagent={"case_dir": "/path/to/dsa_experience"}
)
```

### 源码位置

- **文件**: `dsat/workflows/manual/dsagent_workflow.py`
- **行号**: 23-30
- **说明**: 实现 Plan -> Execute -> Log 循环

---

## 6. DeepAnalyze

### 基本信息

**英文名称**: DeepAnalyze
**中文名称**: 深度分析
**适用场景**: 深度数据分析、结构化思考
**配置路径**: `agent` (无独立配置段)

### 独立参数

**无独立参数**

DeepAnalyze 没有独有的 workflow 参数，只使用公共参数。

### v1.9.0+ API 完整示例

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="deepanalyze",
    model="gpt-4o",
    temperature=0.8,
    max_iterations=10,
)

result = agent.run(data)

print(f"Analysis: {result.output}")
print(f"Cost: ${result.cost:.2f}")
```

### 特殊说明

DeepAnalyze 使用结构化标签 (`<Analyze>`, `<Code>`, `<Execute>`, `<Answer>`) 进行多轮对话。

**终止条件**:

1. 检测到 `<Answer>` 块
2. 达到 `max_iterations`

### 源码位置

- **文件**: `dsat/workflows/manual/deepanalyze_workflow.py`
- **行号**: 46
- **代码**: `self.max_iterations = agent_config.get("max_iterations", 10)`

---

## 7. 参数映射表

### 嵌套字典 → 配置路径映射

| Workflow | 嵌套字典键 | 配置路径 (Config Path) | 说明 |
|----------|-----------|----------------------|------|
| **AIDE** | `aide` | `agent.search.*` | AIDE 独立参数映射到 agent.search |
| **AutoKaggle** | `autokaggle` | `agent.autokaggle.*` | AutoKaggle 独立参数 |
| **AutoMind** | `automind` | `workflow.params.*` | AutoMind 独立参数 |
| **DS-Agent** | `dsagent` | `workflow.params.*` | DS-Agent 独立参数 |
| **DataInterpreter** | `data_interpreter` | (无独立参数) | 仅使用公共参数 |
| **DeepAnalyze** | `deepanalyze` | (无独立参数) | 仅使用公共参数 |

### 完整映射示例

```python
# ========== AutoKaggle ==========
agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={
        "max_attempts_per_phase": 5,    # → agent.autokaggle.max_attempts_per_phase
        "success_threshold": 3.5        # → agent.autokaggle.success_threshold
    }
)

# ========== AIDE ==========
agent = dslighting.Agent(
    workflow="aide",
    aide={
        "num_drafts": 5,        # → agent.search.num_drafts
        "debug_prob": 0.8,      # → agent.search.debug_prob
        "max_debug_depth": 10   # → agent.search.max_debug_depth
    }
)

# ========== AutoMind ==========
agent = dslighting.Agent(
    workflow="automind",
    automind={
        "case_dir": "./exp"     # → workflow.params.case_dir
    }
)

# ========== DS-Agent ==========
agent = dslighting.Agent(
    workflow="dsagent",
    dsagent={
        "case_dir": "./exp"     # → workflow.params.case_dir
    }
)
```

---

## 8. 公共参数

这些参数不属于任何特定 workflow，适用于所有 agent：

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `model` | str | "gpt-4o" | LLM 模型名称 |
| `temperature` | float | 0.5 | 生成温度 (0.0-1.0) |
| `max_iterations` | int | 10 | 最大迭代次数 |
| `keep_workspace` | bool | False | 是否保留工作空间 |
| `keep_workspace_on_failure` | bool | True | 失败时是否保留工作空间 |

---

## 9. 快速参考卡片

### AIDE

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="aide",
    model="gpt-4o",
    temperature=0.7,
    max_iterations=10,
)

result = agent.run(data)
print(f"Score: {result.score}")
```

### AutoKaggle

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="autokaggle",
    autokaggle={
        "max_attempts_per_phase": 5,
        "success_threshold": 3.5
    }
)

result = agent.run(data)
print(f"Score: {result.score}")
```

### DataInterpreter

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="data_interpreter",
    model="gpt-4o-mini",
    max_iterations=5,
)

result = agent.run(data)
print(f"Output: {result.output}")
```

### AutoMind

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="automind",
    automind={
        "case_dir": "./experience_replay",
        "enable_rag": True  # 启用知识库检索
    }
)

result = agent.run(data)
print(f"Score: {result.score}")

# 禁用 RAG（避免 HuggingFace）
agent = dslighting.Agent(
    workflow="automind",
    automind={"enable_rag": False}
)
```

### DS-Agent

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("/path/to/your/data")

agent = dslighting.Agent(
    workflow="dsagent",
    dsagent={
        "case_dir": "./experience_replay"
    }
)

result = agent.run(data)
print(f"Score: {result.score}")
```

### DeepAnalyze

```python
from dotenv import load_dotenv
load_dotenv()

import dslighting

data = dslighting.load_data("data.csv")

agent = dslighting.Agent(
    workflow="deepanalyze",
    model="gpt-4o",
    max_iterations=10,
)

result = agent.run(data)
print(f"Output: {result.output}")
```

---

## 版本说明

- **版本**: DSLighting v1.9.0+
- **发布日期**: 2026-01-17
- **向后兼容**: 100% 兼容 v1.8.x 旧格式
- **文档类型**: PyPI API 参数参考

---

## 附录: 源码参考

所有 workflow 源码位于: `dsat/workflows/`

- AIDE: `search/aide_workflow.py`
- AutoKaggle: `manual/autokaggle_workflow.py`
- DataInterpreter: `manual/data_interpreter_workflow.py`
- AutoMind: `search/automind_workflow.py`
- DS-Agent: `manual/dsagent_workflow.py`
- DeepAnalyze: `manual/deepanalyze_workflow.py`
