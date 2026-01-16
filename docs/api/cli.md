# 命令行工具 (CLI) 参考

除了 Python API，`dslighting` 还提供了一个功能强大的命令行接口（CLI），让您可以直接在终端中运行和管理基准测试。这对于将 `dslighting` 集成到自动化脚本或 CI/CD 流水线中特别有用。

## `dslighting run`

`dslighting run` 是核心命令，其功能与 Python API 中的 `dslighting.run()` 函数类似。它允许您通过命令行参数灵活地运行和覆盖 `benchmark.yml` 文件中的配置。

### 使用方法

```bash
dslighting run [OPTIONS] <BENCHMARK_PATH>
```

### 位置参数

- **`BENCHMARK_PATH`**: [必需] 指向您要运行的 `benchmark.yml` 文件的路径。

### 选项 (OPTIONS)

以下是常用的一些选项，它们可以用来覆盖 `benchmark.yml` 文件中的默认配置。

- **`--task-id TEXT`**:
  如果设置此项，将只运行 `benchmark.yml` 中具有指定 ID 的单个任务，而不是所有任务。

- **`--workflow TEXT`**:
  覆盖任务中指定的 `workflow`。例如，您可以用 `--workflow aide` 来强制所有任务使用 `aide` 工作流。

- **`--intent TEXT`**:
  覆盖任务中指定的 `intent`。

- **`--llm-model TEXT`**:
  覆盖任务或全局配置中指定的 LLM 模型。例如 `--llm-model gpt-4-turbo`。

- **`--output-dir DIRECTORY`**:
  指定输出目录的根路径。默认是在当前目录下创建一个 `output/` 文件夹。

- **`--config-file PATH`**:
  指定一个全局配置文件 `config.yml` 的路径。

- **`-h`, `--help`**:
  显示帮助信息。

## 使用示例

### 1. 运行一个完整的基准测试

这是最常见的用法，等同于 `python -c "import dslighting; dslighting.run('benchmark.yml')"`。

```bash
dslighting run path/to/your/benchmark.yml
```

### 2. 只运行基准测试中的单个任务

假设您的 `benchmark.yml` 中定义了 `eda-task` 和 `training-task`，您可以使用 `--task-id` 只运行训练任务。

```bash
dslighting run benchmark.yml --task-id training-task
```

### 3. 在命令行中覆盖配置

您可以利用命令行参数快速进行实验，而无需修改 YAML 文件。例如，尝试使用不同的 LLM 来执行同一个任务。

```bash
# 使用 gpt-4-turbo 运行
dslighting run benchmark.yml --task-id eda-task --llm-model gpt-4-turbo

# 换成 claude-3-opus 试试
dslighting run benchmark.yml --task-id eda-task --llm-model claude-3-opus
```

### 4. 指定输出目录

将所有运行结果统一存放在一个指定的文件夹中。

```bash
dslighting run benchmark.yml --output-dir /data/dslighting_runs
```
