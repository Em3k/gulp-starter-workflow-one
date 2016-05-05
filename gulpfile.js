///////////////////////////////////////////////////////////////////////
// PLUGINS DECLARATIONS
///////////////////////////////////////////////////////////////////////
var gulp          = require("gulp"),
    sass          = require("gulp-sass"),
    concat        = require("gulp-concat"),
    watch         = require("gulp-watch"),
    plumber       = require("gulp-plumber"),
    cleanCSS      = require("gulp-clean-css"),
    uglify        = require("gulp-uglify"),
    sourcemaps    = require("gulp-sourcemaps"),
    autoprefixer  = require("gulp-autoprefixer"),
    rename        = require("gulp-rename"),
    gulpif        = require("gulp-if"),
    minifyHTML    = require("gulp-minify-html"),
    browserify    = require("browserify"),
    watchify      = require("watchify"),
    gutil         = require('gulp-util'),
    source        = require("vinyl-source-stream"),
    buffer        = require("vinyl-buffer"),
    assign        = require("lodash.assign"),
    streamify     = require("gulp-streamify"),
    browserSync   = require("browser-sync").create(),
    notify        = require("gulp-notify");

///////////////////////////////////////////////////
// main variables

var env,
    sassSources,
    htmlSources,
    jsSources,
    outputDir;

///////////////////////////////////////////////////
// Enviroment var

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'app/development/'
} else {
  outputDir = 'app/production/'
}


///////////////////////////////////////////////////
// PATHS DECLARATIONS

sassSources = ['app_components/sass/app.scss'];
htmlSources = [outputDir + '/**/*.html'];

jsSources = [
  'app_components/scripts/rclick.js',
  'app_components/scripts/pixgrid.js',
  'app_components/scripts/tagline.js',
  'app_components/scripts/template.js',
  'app_components/scripts/script.js'
];

///////////////////////////////////////////////////
// Error Handler (for PLUMBER plugin)
var onError = function(err) {
  console.log(err);
  this.emit('end');
}

///////////////////////////////////////////////////////////////////////
// Task: SASS
///////////////////////////////////////////////////////////////////////

gulp.task('sass', function() {

  return gulp.src(sassSources)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(sass())
    .pipe(autoprefixer({
              browsers: ['last 3 versions'],
              cascade: false
          }))
    //.pipe(gulpif(env === 'production', rename({suffix: '.min'})))
    .pipe(gulpif(env === 'production', cleanCSS({debug: true})))
    .pipe(gulpif(env === 'development', sourcemaps.init()))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest(outputDir + 'assets/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({message: 'SASS OK'}));
});




///////////////////////////////////////////////////////////////////////
// Task: JavaScript
///////////////////////////////////////////////////////////////////////

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulpif(env === 'production', uglify()))
    //.pipe(gulpif(env === 'production', rename({suffix: '.min'})))
    .pipe(gulp.dest(outputDir + 'assets/js'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({message: 'JS OK'}));
});


/*
gulp.task('browserify2', function() {
  return browserify('./app_components/scripts/main.js')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest('./app/development/assets/js'))
});
*/



//----------------------------------------------------
//----------------------------------------------------
// add custom browserify options here
var customOpts = {
  entries:  ['./app_components/scripts/main.js'],
  debug:    true
};
var opts  = assign({}, watchify.args, customOpts);
var b     = watchify(browserify(opts));

// gulp task
gulp.task('js2', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
      .on('error', gutil.log.bind(gutil, gutil.colors.red(
      '\n\n*********************************** \n' +
      'BROWSERIFY ERROR:' +
      '\n*********************************** \n\n'
  )))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulpif(env === 'development', sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest(outputDir + 'assets/js'))
    .pipe(browserSync.reload({stream:true}));
}




///////////////////////////////////////////////////////////////////////
// Task: HTML
///////////////////////////////////////////////////////////////////////

gulp.task('html', function() {
  gulp.src('app/development/*.html')
  .pipe(plumber())
  .pipe(gulpif(env === 'production', minifyHTML()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  .pipe(browserSync.reload({stream: true}))
  .pipe(notify({message: 'HTML OK'}));
});




///////////////////////////////////////////////////////////////////////
// Task: BrowserSync
///////////////////////////////////////////////////////////////////////

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
        baseDir: outputDir
    }
  });
});




///////////////////////////////////////////////////////////////////////
// Task: WATCH
///////////////////////////////////////////////////////////////////////

gulp.task('watch', function () {
  //gulp.watch(jsSources, ['js']);
  gulp.watch('app_components/sass/**/*.scss', ['sass']);
  gulp.watch('app/development/*.html', ['html']).on('change', browserSync.reload);
});



///////////////////////////////////////////////////////////////////////
// Task: DEFAULT
///////////////////////////////////////////////////////////////////////

gulp.task('default', ['js2', 'sass', 'html', 'browser-sync', 'watch']);
