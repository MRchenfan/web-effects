'use strict';
let gulp = require('gulp');
let browserSync = require('browser-sync');
let reload = browserSync.reload;

// browser-sync
gulp.task('default', [], function() {
	browserSync.init({
		server: {
			baseDir: "./src"
		}
	});

	gulp.watch('./src/**/*.html').on('change', reload);
	gulp.watch('./src/**/*.css').on('change', reload);
	gulp.watch('./src/**/*.js').on('change', reload);
});
