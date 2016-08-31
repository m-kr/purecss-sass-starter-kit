var gulp 			= require('gulp');
var browserSync 	= require('browser-sync').create();
var autoprefixer 	= require('gulp-autoprefixer');
var uglify 			= require('gulp-uglify');
var concat 			= require('gulp-concat');
var minfycss 		= require('gulp-minify-css');
var gutil 			= require('gulp-util');
var sass 			= require('gulp-sass');
var sourcemaps		= require('gulp-sourcemaps');

var options = {
	paths: {
		scssSrc: './src/sass/**/*.scss',
		cssDest: './assets/css',
		jsSrc: 'src/js/**/*.js',
		jsDest: 'assets/js'
	},
	sourcemaps: {
		includeContent: false
	},
	autoprefixer: {
		browsers: [
			'last 2 versions',
			'android 4',
			'opera 12'
		],
		cascade: false
	},
	sass: {
		includePaths: ['./src/sass', './assets/vendor']
	},
	changeFilesWatchedPaths: ['./index.html', './assets/css/app.css', './assets/js/app.min.js']
};

gulp.task('scripts', function() {
	return gulp.src(options.paths.jsSrc)
		.on('error', gutil.log)
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(options.paths.jsDest));
});


gulp.task('sass', function () {
	return gulp.src(options.paths.scssSrc)
		.pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass(options.sass))
		.pipe(autoprefixer(options.autoprefixer))
		.pipe(minfycss())
		.pipe(sourcemaps.write('./', options.paths.options))
		.pipe(gulp.dest(options.paths.cssDest));
});


gulp.task('serve', ['sass', 'scripts'], function() {
	browserSync.init({
		server: './'
	});

	gulp.watch(options.paths.scssSrc, ['sass']);
	gulp.watch(options.paths.jsSrc, ['scripts']);
	gulp.watch(options.changeFilesWatchedPaths).on('change', browserSync.reload);
});

gulp.task('default', function() {
	gulp.start('sass', 'scripts');
});