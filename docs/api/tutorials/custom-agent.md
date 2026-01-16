# 教程：创建自定义 Agent

`dslighting` 的强大之处不仅在于其内置的 `aide` 和 `automind` 工作流，更在于其出色的可扩展性。当内置 Agent 无法满足您的特定需求时，您可以轻松创建自己的 Agent。

本教程将指导您创建一个简单的自定义 Agent，它会读取任务的 `intent`，并将其写入一个文本文件中。

## 1. Agent 的基本结构

在 `dslighting` 中，所有的 Agent 都继承自 `dslighting.Agent` 基类。您只需要实现一个核心方法：`run()`。

在 `run()` 方法中，您可以访问以下一些有用的属性：
- **`self.intent`**: 当前任务的意图字符串。
- **`self.log(message)`**: 向 `dslighting.log` 中打印日志。
- **`self.artifact_path`**: 指向当前任务产物目录的路径 (`artifacts/`)。您可以将任何结果文件保存在这里。
- **`self.data_path(...)`**: 获取输入数据的路径。

## 2. 编写自定义 Agent

让我们开始编写代码。首先，创建一个名为 `custom_agents` 的文件夹，并在其中创建一个 `my_agent.py` 文件。

```python
# custom_agents/my_agent.py

from dslighting import Agent

class MyCustomAgent(Agent):
    """
    一个简单的自定义 Agent，它将任务的 intent 写入一个文件中。
    """
    def run(self):
        # 1. 记录一条日志，表明 Agent 已开始工作
        self.log(f"Hello from MyCustomAgent! The user's intent is: {self.intent}")

        # 2. 定义输出文件的路径
        output_file_path = self.artifact_path / "intent_record.txt"

        # 3. 将 intent 写入文件
        with open(output_file_path, "w") as f:
            f.write(self.intent)

        # 4. 记录一条日志，表明任务已完成
        self.log(f"Successfully wrote the intent to {output_file_path}")

```

## 3. 使用自定义 Agent

现在我们已经有了自己的 Agent，接下来需要告诉 `dslighting` 如何找到并使用它。

### a. 编写 Benchmark 配置

创建一个 `custom_agent_benchmark.yml` 文件。在 `workflow` 字段，我们填入自定义 Agent 的类名的小写蛇形命名（`MyCustomAgent` -> `my_custom_agent`）。

```yaml
# custom_agent_benchmark.yml
name: custom-agent-test
version: '1.0'

tasks:
  - id: test-my-agent
    # ✨ 这里使用我们自定义的 Agent
    workflow: my_custom_agent
    intent: "This is a test intent for our custom agent."
```

### b. 编写并运行 Python 脚本

最后，创建 `run_custom.py`。在调用 `dslighting.run()` 之前，我们需要使用 `dslighting.register_agent()` 来注册我们的自定义 Agent。

```python
# run_custom.py
import dslighting
from custom_agents.my_agent import MyCustomAgent

if __name__ == "__main__":
    # 注册我们的自定义 Agent
    # 第一个参数是 YAML 中使用的名称，第二个参数是 Agent 类
    dslighting.register_agent("my_custom_agent", MyCustomAgent)

    # 运行基准测试
    dslighting.run("custom_agent_benchmark.yml")
```

在终端中运行：

```bash
python run_custom.py
```

## 4. 验证结果

运行成功后，查看 `output/custom-agent-test/` 目录。在最新的运行实例中，您会发现：

1.  **日志文件 `dslighting.log`** 中包含了我们自定义的日志信息：
    ```
    ...
    Hello from MyCustomAgent! The user's intent is: This is a test intent for our custom agent.
    Successfully wrote the intent to .../artifacts/intent_record.txt
    ...
    ```

2.  **产物目录 `artifacts`** 中包含了我们生成的文件：
    ```
    ...
    └── test-my-agent/
        └── artifacts/
            └── intent_record.txt
    ```
    `intent_record.txt` 的内容正是我们在 YAML 中定义的 `intent`。

恭喜！您已经成功构建并运行了您的第一个自定义 Agent。基于这个简单的例子，您可以构建更复杂的 Agent 来连接数据库、调用专用 API 或执行任何您需要的自定义逻辑。
