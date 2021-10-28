const { src, dest, parallel, series, watch } = require('gulp')
const del          = require('del')
const fileinclude = require('gulp-file-include')
const sass         = require('gulp-dart-sass')
const sassglob     = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const inlineCss = require('gulp-inline-css')

function styles() {
	return src([`src/scss/*.*`, `!src/scss/_*.*`])
		.pipe(sassglob())
		.pipe(sass())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(dest('src/css'))
}

function buildcopy() {
	return src([
		'src/img/**/*.*'
	], { base: 'src/' })
	.pipe(dest('dist'))
}

async function buildHtml() {
	src(['src/*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(inlineCss({
			preserveMediaQueries: true
		}))
		.pipe(dest('dist'));

	del('dist/parts', { force: true })
}

function cleandist() {
	return del('dist/**/*', { force: true })
}

const build = series(cleandist, buildcopy, styles, buildHtml);

function startwatch() {
	watch([`src/**/*.*`, `!src/css/*.css`], { usePolling: true }, build)
}

exports.build = build
exports.default = startwatch
