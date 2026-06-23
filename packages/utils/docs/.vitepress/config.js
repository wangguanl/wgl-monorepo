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
  base: command === 'build' ? '/page__package-utils/' : '',
  lastUpdated: true,
  title: 'NPM Package',
  description: 'NPM Package',
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
        text: '插件',
        link: 'https://wangguanl.github.io/page__package-plugins/',
      },
      {
        text: '组件',
        // link: 'https://github.com/wangguanl/package__components', // 代码仓库
        link: 'https://wangguanl.github.io/page__package-components/', // 文档
      },
      {
        text: '样式',
        link: 'https://github.com/wangguanl/package__css', // 代码仓库
        // link: '', // 文档
      },
    ],

    sidebar: [
      {
        text: '安装',
        link: '/examples/install',
      },
      {
        text: '更新依赖',
        link: 'https://npmmirror.com/sync/@wgl-m/utils',
      },
      {
        text: '用例',
        items: examples,
      },
    ],
  },
}));
