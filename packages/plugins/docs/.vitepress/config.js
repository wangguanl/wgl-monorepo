import { defineConfig } from 'vitepress';
import fg from 'fast-glob';

const examples = fg
  .sync(['./examples/*.md'])
  .filter(url => url !== './examples/install.md')
  .map(url => {
    const text = url.replace('./examples/', '').split('.')[0];
    return {
      text,
      link: '/examples/' + text,
    };
  });

export default defineConfig(({ command }) => ({
  lang: 'zh-cmn-Hans',
  base: command === 'build' ? '/page__package-plugins/' : '',
  lastUpdated: true,
  title: '@wgl/plugins',
  description: 'Browser-only plugins for web projects',
  themeConfig: {
    siteTitle: '首页',
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
      { text: '用例', link: '/examples/' },
      {
        text: '工具',
        link: 'https://wangguanl.github.io/page__package-utils/',
      },
      {
        text: '样式',
        link: 'https://github.com/wangguanl/wgl-monorepo/tree/main/packages/css',
      },
    ],
    sidebar: [
      {
        text: '安装',
        link: '/examples/install',
      },
      {
        text: '更新依赖',
        link: 'https://npmmirror.com/sync/@wgl/plugins',
      },
      {
        text: '用例',
        items: examples,
      },
    ],
  },
}));
