var gulp       = require('gulp'),
    rollup     = require('gulp-rollup'),
    sourcemaps = require('gulp-sourcemaps');
 
gulp.task('bundle', function() {
  gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
      // transform the files here.
      .pipe(rollup({
        input: './src/main.js'
      }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});