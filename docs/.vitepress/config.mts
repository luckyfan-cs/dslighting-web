import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DSLIGHTING',
  description: '全流程数据科学智能助手 - End-to-End Data Science Intelligent Assistant',
  lang: 'zh-CN',
  base: '/dslighting-web/',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/dslighting-web/logo.png' }]
  ],

  // For personal GitHub Pages
  // Deployed to https://luckyfan-cs.github.io/dslighting-web/

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '核心功能', link: '/guide/features' },
      { text: 'API 文档', link: '/api/overview' },
      {
        text: 'GitHub',
        link: 'https://github.com/usail-hkust/dslighting'
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速上手', link: '/guide/getting-started' },
            { text: '核心概念', link: '/guide/core-concepts' },
            { text: '数据准备', link: '/guide/data-preparation' },
            { text: '配置说明', link: '/guide/configuration' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        },
        {
          text: '教程',
          items: [
            { text: '运行你的第一个基准测试', link: '/guide/tutorials/first-benchmark' },
            { text: '创建自定义 Agent', link: '/guide/tutorials/custom-agent' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'Python API', link: '/api/python-api' },
            { text: '命令行工具 (CLI)', link: '/api/cli' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/usail-hkust/dslighting' }
    ],

    footer: {
      message: '基于 AGPL-3.0 许可证发布',
      copyright: 'Copyright © 2025-present USAIL Lab'
    },

    search: {
      provider: 'local'
    }
  }
})
