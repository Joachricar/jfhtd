var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var browserSync = require('browser-sync');
var paths = {
    pages: ['src/*.html']
};


var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("build"));
});

var bundle = () => {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("build/js"));
}

gulp.task("bundle", ["copy-html"], bundle);

gulp.task('default', ["bundle"], () => {
    browserSync.init({
        server: {
            baseDir : 'build/'
        }
    });

    return gulp.watch('build/js/bundle.js', () => {
        browserSync.reload();
    });
})

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);