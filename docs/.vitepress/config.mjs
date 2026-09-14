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

/** 通用：生成某组件包 examples 的 glob 侧边栏项 */
function componentExamples(pkg) {
  const dir = `./docs/packages/components/${pkg}/examples`;
  return fg
    .sync([`${dir}/*.md`])
    .filter(url => url !== `${dir}/install.md`)
    .map(url => {
      const text = url.replace(`${dir}/`, '').split('.')[0];
      return {
        text,
        link: `/packages/components/${pkg}/examples/` + text,
      };
    });
}

export default defineConfig(({ command }) => ({
  lang: 'zh-cmn-Hans',
  base: command === 'build' ? '/wgl-monorepo/' : '',
  lastUpdated: true,
  title: '@wgl-m/*',
  description: 'WGL Monorepo — Utils · Plugins · Node Utils · CSS · Components',
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
      { text: 'Components', link: '/packages/components/' },
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
      '/packages/components/': [
        {
          text: '组件总览',
          link: '/packages/components/',
        },
        {
          text: 'FolderTree 核心',
          collapsed: false,
          items: [
            { text: '安装', link: '/packages/components/folder-tree/examples/install' },
            { text: '用例', items: componentExamples('folder-tree') },
          ],
        },
        {
          text: 'FolderTree Vue',
          collapsed: false,
          items: [
            { text: '安装', link: '/packages/components/folder-tree-vue/examples/install' },
            { text: '用例', items: componentExamples('folder-tree-vue') },
          ],
        },
        {
          text: 'FolderTree React',
          collapsed: false,
          items: [
            { text: '安装', link: '/packages/components/folder-tree-react/examples/install' },
            { text: '用例', items: componentExamples('folder-tree-react') },
          ],
        },
        {
          text: '开发指南',
          items: [{ text: '本地引用指南', link: '/local-usage' }],
        },
      ],
    },
    '/local-usage': [{ text: '本地引用指南', link: '/local-usage' }],
  },
}));