var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();


gulp.task('scripts', function() {
  return gulp
    .src('src/**/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(plugins.rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist'))
    .pipe(plugins.gzip())
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('styles', function() {
  return gulp
    .src('src/**/*.scss')
    .pipe(plugins.sass({
      errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer(["last 3 versions", "> 1%"], { cascade: true }))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist'))
    .pipe(plugins.gzip())
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('install', function() {
  return gulp.src(['./package.json']).pipe(plugins.install());
});

gulp.task('clean', function(callback) {
  var del = require('del');
  del(['dist/**/*'], callback);
});

gulp.task('default', ['clean', 'install'], function() {
  gulp.start('scripts');
  gulp.start('styles');

});

gulp.task('watch', ['default'], function() {
  gulp.watch(['src/**/*.js'], ['scripts']);
  gulp.watch(['src/**/*.scss'], ['styles']);
});
