var gulp = require('gulp');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('scripts', function() {
  var uglify = require('gulp-uglify');
  gulp
    .src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('styles', function() {
  var
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer');

  gulp
    .src('src/**/*.scss')
    .pipe(sass())
    .pipe(prefix(["last 3 versions", "> 1%"], { cascade: true }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  var clean = require('gulp-clean');
  return gulp
    .src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts');
  gulp.start('styles');

});

gulp.task('watch', ['default'], function() {
  gulp.watch(['src/**/*.js'], ['scripts']);
  gulp.watch(['src/**/*.scss'], ['styles']);
});
