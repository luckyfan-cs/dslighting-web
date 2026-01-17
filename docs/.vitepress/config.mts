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
      { text: '项目指南', link: '/guide/getting-started' },
      { text: 'Pip 包文档', link: '/api/getting-started' },
      {
        text: 'GitHub',
        link: 'https://github.com/usail-hkust/dslighting'
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '项目开发指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '核心功能', link: '/guide/features' },
            { text: '数据准备', link: '/guide/data-preparation' },
            { text: '配置说明', link: '/guide/configuration' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        }
      ],
      '/api/': [
        {
          text: '指南',
          items: [
            { text: '快速上手', link: '/api/getting-started' },
            { text: '核心概念', link: '/api/core-concepts' },
            { text: '数据系统', link: '/api/data-system' },
            { text: 'Agent 参数', link: '/api/agent' },
          ]
        },
        {
          text: '教程',
          items: [
            { text: '教程：运行你的第一个基准测试', link: '/api/tutorials/first-benchmark' },
            { text: '教程：创建自定义 Agent', link: '/api/tutorials/custom-agent' }
          ]
        },
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
