// 压缩css
const gulp = require("gulp"),
  sass = require("gulp-dart-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  rename = require("gulp-rename");
module.exports = (src, dist) =>
  gulp
    .src(src)
    .pipe(sass().on("error", sass.logError)) // sass编译
    .pipe(postcss([autoprefixer()])) // 添加前缀
    .pipe(cleanCSS()) // 压缩
    .pipe(
      rename({
        extname: ".css",
      })
    )
    .pipe(gulp.dest(dist));
