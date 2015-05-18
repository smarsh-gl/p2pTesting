var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('js', function() {
    return gulp.src(['./front/js/*.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./web/'));
});

gulp.task('css', function() {
    return gulp.src("./front/css/*.css")
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest("./web/css/"));
});

gulp.task('html', function() {
    return gulp.src("./front/*.html")
        .pipe(gulp.dest("./web/"));
});

gulp.task('images', function() {
    return gulp.src("./front/img/*")
        .pipe(gulp.dest("./web/images"));
});


gulp.task('default', [
    'js',
    'html',
    'css',
    'images'
]);