var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jsonminify = require('gulp-jsonminify');
var postcss = require('gulp-postcss');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var babel = require('babelify');
var _if = require('gulp-if');

var is_production = process.env['NODE_ENV'] === 'production';

gulp.task('css', function () {
    return gulp.src([
        './node_modules/normalize.css/normalize.css',
        './node_modules/leaflet/dist/leaflet.css',
        './src/style/*.scss'
    ])
        .pipe(sourcemaps.init())
        .pipe(postcss([
            require('postcss-custom-properties'),
            require('postcss-nested'),
            autoprefixer({browsers: ['last 2 versions']})
        ]))
        .pipe(_if(is_production, postcss([require('cssnano')])))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'));
});

gulp.task('compile', function () {
    return gulp.src('./src/index.js')
        //.pipe(sourcemaps.init())
        .pipe(browserify({
            transform: [babel],
            debug: !is_production
        }))
        .pipe(_if(is_production, uglify()))
        .pipe(rename('app.js'))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-public', function () {
    return gulp.src('./src/public/**')
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-leaflet-images', function () {
    return gulp.src('./node_modules/leaflet/dist/images/*')
        .pipe(gulp.dest('./build/images'));
});

gulp.task('enable-production', function () {
    is_production = true;
});

gulp.task('data', function () {
    return gulp.src('./data/*.geojson')
        .pipe(_if(is_production, jsonminify()))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy', ['data', 'copy-public', 'copy-leaflet-images']);
gulp.task('default', ['copy', 'css', 'compile']);
gulp.task('production', ['enable-production', 'default']);
