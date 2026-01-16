# Python API 参考

`dslighting` 提供了一个简洁而强大的 Python API，用于编排、执行和扩展您的数据科学工作流。

## 核心函数

### `dslighting.run()`

这是 `dslighting` 的主要入口点，用于加载并执行一个基准测试文件。

```python
dslighting.run(benchmark_path: str)
```

**参数:**
- **`benchmark_path` (str)**: 指向 `benchmark.yml` 文件的路径。

**作用:**
此函数会解析指定的 YAML 文件，并按顺序执行其中定义的每一个任务。对于每个任务，它会：
1.  实例化 `workflow` 字段中指定的 Agent。
2.  为该任务创建一个唯一的输出目录。
3.  调用 Agent 的 `.run()` 方法来执行任务。
4.  捕获日志、产物和快照。

**示例:**
```python
import dslighting

# 运行一个定义在 "benchmark.yml" 中的基准测试
dslighting.run("benchmark.yml")
```

---

### `dslighting.configure()`

用于在代码中全局配置 `dslighting` 的行为，例如设置 API 密钥。

在此函数中设置的参数拥有最高优先级，会覆盖所有其他配置（如环境变量或配置文件）。

```python
dslighting.configure(**kwargs)
```

**常用参数:**
- **`openai_api_key` (str)**: 您的 OpenAI API 密钥。
- **`zhipuai_api_key` (str)**: 您的智谱 AI API 密钥。
- **`deepseek_api_key` (str)**: 您的硅基流动 API 密钥。
- **`output_dir` (str)**: 指定输出目录的根路径，默认为 `./output`。

**示例:**
```python
import dslighting

# 在代码中安全地配置 API Key
dslighting.configure(
    openai_api_key="sk-...",
    zhipuai_api_key="your-zhipu-key"
)

dslighting.run("benchmark.yml")
```

---

### `dslighting.register_agent()`

用于注册一个自定义的 Agent 类，以便可以在 `benchmark.yml` 文件中通过名称引用它。

```python
dslighting.register_agent(name: str, agent_class: type[Agent])
```

**参数:**
- **`name` (str)**: 您为 Agent 指定的名称（小写蛇形命名法，例如 `my_agent`）。这个名称将被用在 YAML 文件的 `workflow` 字段。
- **`agent_class` (type[Agent])**: 您的自定义 Agent 类（必须是 `dslighting.Agent` 的子类）。

**示例:**
请参考 **[教程：创建自定义 Agent](/guide/tutorials/custom-agent)**。

## 基类

### `dslighting.Agent`

所有自定义 Agent 的基类。通过继承这个类并实现 `run` 方法，您可以创建自己的工作流。

```python
from dslighting import Agent

class MyAgent(Agent):
    def run(self):
        # 在这里实现您的自定义逻辑
        pass
```

在 `run` 方法内部，您可以访问以下由基类提供的常用属性和方法：

**属性:**
- **`self.intent` (str)**: 当前任务的 `intent` 字符串，来自 YAML 文件。
- **`self.log_path` (Path)**: 指向当前任务的根日志目录。
- **`self.artifact_path` (Path)**: 指向当前任务的产物目录 (`artifacts/`)。强烈建议将所有输出文件（模型、报告、数据等）保存在此。
- **`self.snapshot_path` (Path)**: 指向快照目录，用于保存代码和环境快照。
- **`self.data_path(key)` (Path)**: 获取在 YAML 中定义的输入数据路径。例如，`self.data_path("train_path")`。

**方法:**
- **`self.log(message: str)`**: 向 `dslighting.log` 写入一条格式化的日志。推荐使用此方法进行日志记录，而不是 `print()`。
- **`self.run_command(command: str)`**: 在 shell 中执行一个命令，并将其输出流式传输到日志中。
