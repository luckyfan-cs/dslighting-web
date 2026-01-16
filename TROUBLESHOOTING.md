# 🔧 部署故障排除指南

## 问题描述
GitHub Actions 持续失败，导致网站无法正常部署。

## 当前状态
- ✅ 已删除冲突的 Jekyll workflow
- ✅ 本地构建成功
- ❌ GitHub Actions 部署失败

## 🎯 解决方案

### 步骤 1: 检查 GitHub Pages 环境配置

1. 访问仓库设置：https://github.com/luckyfan-cs/dslighting-web/settings/pages

2. 确认以下配置：
   - **Source**: `GitHub Actions` ✅
   - 如果看到警告提示配置环境，按照提示操作

### 步骤 2: 检查仓库权限

1. 访问：https://github.com/luckyfan-cs/dslighting-web/settings/actions

2. 确保 **Workflow permissions** 设置为：
   - ✅ `Read and write permissions`

3. 如果需要，点击 "Save" 保存

### 步骤 3: 配置 Pages 环境（如果需要）

如果 GitHub 提示需要配置 Pages 环境：

1. 访问：https://github.com/luckyfan-cs/dslighting-web/settings/environments

2. 检查是否存在 `github-pages` 环境

3. 如果不存在，创建一个：
   - Name: `github-pages`
   - 保留默认设置

### 步骤 4: 检查 Actions 工作流权限

访问工作流文件查看权限配置：
https://github.com/luckyfan-cs/dslighting-web/blob/main/.github/workflows/deploy.yml

确认包含以下权限：
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 步骤 5: 手动重新运行工作流

1. 访问 Actions 页面：https://github.com/luckyfan-cs/dslighting-web/actions

2. 点击最近失败的 "Deploy Website" workflow

3. 点击右上角的 "Re-run all jobs" 按钮

### 步骤 6: 验证部署

部署成功后，访问：
- https://luckyfan-cs.github.io/dslighting-web/

应该能看到完整的 VitePress 网站，包括：
- 顶部导航栏
- Logo 和 Hero 区域
- 功能特性卡片
- 侧边栏
- 完整的样式

## 🔍 查看失败日志

如果部署仍然失败，查看详细日志：

1. 访问：https://github.com/luckyfan-cs/dslighting-web/actions

2. 点击最近失败的工作流

3. 点击 "build" 或 "deploy" 任务

4. 展开失败的步骤查看错误信息

## 🆘 常见问题

### Q: 为什么删除了 Jekyll workflow？
A: Jekyll workflow 在构建 README.md 并覆盖 VitePress 网站，导致冲突。

### Q: 需要多长时间部署？
A: 通常 2-3 分钟，构建完成后会自动部署。

### Q: 如何确认部署成功？
A: Actions 页面显示绿色✅，并且网站可以正常访问。

## 📞 需要帮助？

如果按照上述步骤操作后仍有问题，请：
1. 记录错误信息
2. 检查 Actions 日志
3. 确认仓库和 Pages 设置
