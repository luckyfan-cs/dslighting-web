---
layout: home

hero:
  name: "DSLIGHTING"
  text: "数据科学的智能工作流引擎"
  tagline: 使用Python和YAML，轻松构建、运行和评估复杂的数据科学任务流。
  image:
    src: logo.png
    alt: DSLIGHTING Logo
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/getting-started
    - theme: alt
      text: 核心概念
      link: /guide/core-concepts
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/usail-hkust/dslighting

features:
  - icon: 🛠️
    title: 声明式的基准测试
    details: 使用简单的 YAML 文件定义复杂的数据处理、模型训练和评估流程，让代码和配置分离。
  - icon: 🤖
    title: 可扩展的 Agent 工作流
    details: 提供 AIDE、AutoMind 等多种内置 Agent，并支持通过继承基类轻松创建自己的 Agent 来实现自定义逻辑。
  - icon: 🔄
    title: 内置数据处理与准备
    details: 提供标准化的数据准备流程，确保实验的可复现性，并支持接入自定义数据源。
  - icon: 📝
    title: 详尽的日志与产物追踪
    details: 自动为每次运行记录详细日志、代码快照和输出产物，便于调试、复盘和结果共享。
  - icon: 🚀
    title: 强大的命令行工具
    details: 通过 `dslighting` 命令即可运行完整的基准测试、管理数据和查看结果，无缝集成到你的 Shell 环境中。
  - icon: 📊
    title: 灵活的配置系统
    details: 从 LLM 模型到输出目录，所有关键参数均可通过配置文件或命令行参数进行调整，提供极高的灵活性。

---
