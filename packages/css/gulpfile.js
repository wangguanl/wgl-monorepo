// 引入依赖模块
const FS = require('fs'),
  Path = require('path'),
  gulp = require('gulp'),
  buildCSS = require('./build/buildCSS');

const config = {
  input: __dirname + '/src',
  output: __dirname + '/dist',
};
gulp.task('buildCSS', () =>
  buildCSS(
    [
      `${config.input}/*.css`,
      `${config.input}/*.scss`,
      `!${config.input}/*.common.scss`,
    ],
    config.output
  )
);
gulp.task('buildSCSS', () =>
  gulp.src([`${config.input}/static/*.scss`]).pipe(gulp.dest(config.output))
);

gulp.task('removeDir', done => {
  removeDir(config.output);
  done();
});
function removeDir(path) {
  var files = [];
  if (FS.existsSync(path)) {
    files = FS.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + '/' + file;
      if (FS.statSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        FS.unlinkSync(curPath);
      }
    });
    FS.rmdirSync(path);
  }
}
gulp.task(
  'default',
  gulp.series('removeDir', gulp.parallel('buildCSS', 'buildSCSS'), done => {
    FS.copyFileSync(
      Path.resolve(__dirname, './README.md'),
      Path.resolve(__dirname, './dist/README.md')
    );
    done();
  })
);
