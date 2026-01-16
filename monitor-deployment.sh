#!/bin/bash

echo "🔄 检查最新的 GitHub Actions 部署状态..."
echo ""

REPO="luckyfan-cs/dslighting-web"

# 获取最新的 workflow runs
response=$(curl -s "https://api.github.com/repos/${REPO}/actions/runs?per_page=5")

if [ $? -ne 0 ] || [ -z "$response" ]; then
    echo "❌ 无法获取部署状态"
    echo "请手动访问: https://github.com/${REPO}/actions"
    exit 1
fi

# 使用 Python 解析 JSON (如果不可用则显示原始响应)
if command -v python3 &> /dev/null; then
    echo "最近的 5 次运行:"
    echo "----------------------------------------"
    echo "$response" | python3 -c "
import sys, json
from datetime import datetime

runs = json.load(sys.stdin)['workflow_runs']
for i, run in enumerate(runs, 1):
    status_emoji = '✅' if run['conclusion'] == 'success' else '❌' if run['conclusion'] == 'failure' else '⏳'
    print(f\"{i}. {status_emoji} {run['name']}\")
    print(f\"   状态: {run['status']} / {run['conclusion'] or 'running'}\")
    print(f\"   时间: {run['created_at']}\")
    print(f\"   链接: {run['html_url']}\")
    print()
"
else
    echo "$response" | head -50
fi

echo "==================================="
echo "📋 快速链接:"
echo "==================================="
echo ""
echo "1. 查看所有 Actions 运行:"
echo "   https://github.com/${REPO}/actions"
echo ""
echo "2. 查看最新部署:"
echo "   https://github.com/${REPO}/actions/runs"
echo ""
echo "3. 访问网站:"
echo "   https://luckyfan-cs.github.io/dslighting-web/"
echo ""
echo "4. GitHub Pages 设置:"
echo "   https://github.com/${REPO}/settings/pages"
echo ""
echo "==================================="
