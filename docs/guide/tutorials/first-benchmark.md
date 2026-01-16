# 教程：运行你的第一个基准测试

在“快速上手”中，我们使用了一个虚拟数据集来体验 `dslighting` 的基本流程。现在，让我们更进一步，使用一个真实的数据集来运行一个完整的机器学习基准测试。

**目标**: 在 Kaggle 的“共享单车需求预测”竞赛数据集上，训练一个模型来预测每小时的租车数量。

## 1. 准备工作

### a. API 密钥

请确保您的 LLM API 密钥已设置为环境变量（例如 `OPENAI_API_KEY`），或者您可以在运行脚本时通过 `dslighting.configure()` 进行配置。

### b. 下载数据

为了方便起见，我们假设数据已经托管在一个公共 URL 上。在实际使用中，您可以替换为您本地的数据路径。

(注：在 `dslighting` 中，您只需提供数据路径，Agent 会负责加载和处理。)

## 2. 编写 Benchmark 配置文件

创建一个 `bike_benchmark.yml` 文件。这次，我们将使用 `automind`工作流，它专门为自动化机器学习任务而设计。

```yaml
# bike_benchmark.yml
name: bike-sharing-demand-benchmark
version: '1.0'

tasks:
  - id: train-bike-demand-model
    # 使用 automind 工作流，专为 AutoML 任务设计
    workflow: automind
    # 定义真实的数据集路径
    # 在这个例子中，我们使用占位符，实际中请替换为真实路径或URL
    data:
      train_path: "https://raw.githubusercontent.com/davidADSP/Data_Analysis_Exercises/main/Kaggle/Bike%20Sharing%20Demand/train.csv"
      test_path: "https://raw.githubusercontent.com/davidADSP/Data_Analysis_Exercises/main/Kaggle/Bike%20Sharing%20Demand/test.csv"
    # 明确告知 Agent 我们的目标
    intent: "Train a model to predict the 'count' column, which represents the total number of bike rentals."
    # 可以在此指定模型，或让 Agent 自行选择
    llm:
      model: "gpt-4-turbo"
```

**与快速上手相比的变化:**
- **`workflow`**: 我们换成了 `automind`，它更适合执行一个标准的、端到端的机器学习任务。
- **`data`**: 我们指向了真实的 CSV 文件 URL。`dslighting` 会自动下载并处理它们。
- **`intent`**: 我们给出了一个更具体的指令：训练模型并预测 `count` 列。

## 3. 编写并运行 Python 脚本

创建 `run_bike.py` 文件。

```python
# run_bike.py
import dslighting

if __name__ == "__main__":
    # 如果需要，请在此处配置你的 API Key
    # dslighting.configure(openai_api_key="sk-...")

    # 运行我们刚刚定义的自行车需求预测基准测试
    dslighting.run("bike_benchmark.yml")
```

在终端中运行它：

```bash
python run_bike.py
```

`automind` 工作流会执行以下一系列步骤：
1.  加载和分析数据。
2.  进行特征工程。
3.  选择、训练和验证模型。
4.  在测试集上进行预测。
5.  生成评估报告和提交文件。

## 4. 分析结果

运行完成后，查看 `output/bike-sharing-demand-benchmark/` 目录。在最新的运行实例文件夹中，您会特别关注 `artifacts` 目录：

```
...
└── train-bike-demand-model/
    └── artifacts/
        ├── submission.csv     # 符合 Kaggle 格式的提交文件
        ├── model.pkl          # 训练好的模型文件
        ├── evaluation_report.md # 模型性能评估报告
        └── feature_importance.png # 特征重要性图
```

- **`submission.csv`**: 您可以直接将此文件提交到 Kaggle 竞赛。
- **`model.pkl`**: 序列化后的模型，您可以加载它用于推理。
- **`evaluation_report.md`**: Agent 生成的报告，详细说明了它的工作流程、模型选择、验证分数等。这是理解 Agent决策过程的关键。

通过这个教程，您已经学会了如何使用 `dslighting` 来自动化一个完整的机器学习项目。

## 下一步

- **[教程：创建自定义 Agent](/guide/tutorials/custom-agent)**: 学习如何构建自己的 Agent 来执行特定任务。
- **[API 参考](/api/python-api)**: 探索更多高级功能。
