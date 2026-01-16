#!/bin/bash

echo "🔍 检查 VitePress 构建文件..."
echo ""

if [ -f "docs/.vitepress/dist/index.html" ]; then
    echo "✅ index.html 存在"
    echo "文件大小: $(du -h docs/.vitepress/dist/index.html | cut -f1)"
else
    echo "❌ index.html 不存在"
fi

echo ""
echo "🔍 检查 CSS 文件..."
if [ -f "docs/.vitepress/dist/assets/style.B7KsBJRa.css" ]; then
    echo "✅ CSS 文件存在"
    echo "文件大小: $(du -h docs/.vitepress/dist/assets/style.B7KsBJRa.css | cut -f1)"
else
    echo "❌ CSS 文件不存在"
fi

echo ""
echo "🔍 检查 .nojekyll 文件..."
if [ -f "docs/.vitepress/dist/.nojekyll" ]; then
    echo "✅ .nojekyll 文件存在"
else
    echo "❌ .nojekyll 文件不存在（需要创建）"
fi

echo ""
echo "🔍 检查 dist 目录内容..."
echo "目录列表:"
ls -lh docs/.vitepress/dist/ | head -15

echo ""
echo "==================================="
echo "📋 下一步操作指南："
echo "==================================="
echo ""
echo "1. 访问 GitHub Pages 设置："
echo "   https://github.com/luckyfan-cs/dslighting-web/settings/pages"
echo ""
echo "2. 确保 'Source' 设置为 'GitHub Actions'"
echo "   (不是 'Deploy from a branch')"
echo ""
echo "3. 如果修改了设置，等待几分钟让 GitHub Actions 重新部署"
echo ""
echo "4. 检查部署状态："
echo "   https://github.com/luckyfan-cs/dslighting-web/actions"
echo ""
echo "5. 部署完成后访问："
echo "   https://luckyfan-cs.github.io/dslighting-web/"
echo ""
