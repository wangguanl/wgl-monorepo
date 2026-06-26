import { defineConfig } from 'vitepress';
import fg from 'fast-glob';

const utilsExamples = fg
  .sync(['./docs/packages/utils/examples/*.md'])
  .filter(url => url !== './docs/packages/utils/examples/install.md')
  .map(url => {
    const text = url.replace('./docs/packages/utils/examples/', '').split('.')[0];
    return {
      text,
      link: '/packages/utils/examples/' + text,
    };
  });

const pluginsExamples = fg
  .sync(['./docs/packages/plugins/examples/*.md'])
  .filter(url => url !== './docs/packages/plugins/examples/install.md')
  .map(url => {
    const text = url.replace('./docs/packages/plugins/examples/', '').split('.')[0];
    return {
      text,
      link: '/packages/plugins/examples/' + text,
    };
  });

export default defineConfig(({ command }) => ({
  lang: 'zh-cmn-Hans',
  base: command === 'build' ? '/wgl-monorepo/' : '',
  lastUpdated: true,
  title: '@wgl-m/*',
  description: 'WGL Monorepo — Utils, Plugins, Node Utils, CSS',
  srcExclude: ['typescript-migration/**', 'documentation-site/**', 'README.md'],
  themeConfig: {
    siteTitle: '@wgl-m/*',
    lastUpdatedText: '最后更新时间',
    outline: 'deep',
    outlineBadges: false,
    outlineTitle: '目录',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wangguanl/wgl-monorepo' },
    ],

    nav: [
      { text: 'Utils', link: '/packages/utils/' },
      { text: 'Plugins', link: '/packages/plugins/' },
      { text: 'Node Utils', link: '/packages/node-utils/' },
      { text: 'CSS', link: '/packages/css/' },
    ],

    sidebar: {
      '/packages/utils/': [
        {
          text: '安装',
          link: '/packages/utils/examples/install',
        },
        {
          text: '更新依赖',
          link: 'https://npmmirror.com/sync/@wgl-m/utils',
        },
        {
          text: '用例',
          items: utilsExamples,
        },
      ],
      '/packages/plugins/': [
        {
          text: '安装',
          link: '/packages/plugins/examples/install',
        },
        {
          text: '更新依赖',
          link: 'https://npmmirror.com/sync/@wgl-m/plugins',
        },
        {
          text: '用例',
          items: pluginsExamples,
        },
      ],
      '/packages/node-utils/': [
        {
          text: '安装',
          link: '/packages/node-utils/install',
        },
        {
          text: 'API',
          link: '/packages/node-utils/',
        },
      ],
      '/packages/css/': [
        {
          text: '使用指南',
          link: '/packages/css/usage',
        },
        {
          text: '概览',
          link: '/packages/css/',
        },
      ],
    },
  },
}));