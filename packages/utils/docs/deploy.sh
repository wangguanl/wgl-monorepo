set -e

pnpm --filter @wgl/utils docs:build

cd .vitepress/dist

git init
git add -A
git commit -m "自动部署"
git push -f git@github.com:wangguanl/page__package-utils.git master:gh-pages
