// простая сборка
"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var htmlmin = require("gulp-htmlmin");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");
var uglify = require("gulp-uglify");
var pump = require("pump");
var svgmin = require("gulp-svgmin");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("minify", function (cb) {
  pump([
    gulp.src("source/js/**/*.js"),
    sourcemaps.init(),
    uglify(),
    rename({suffix: ".min"}),
    sourcemaps.write(),
    gulp.dest("build/js/min")
    ], cb);
});

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});



gulp.task("svg", function () {
  return gulp.src("source/img/vector/**/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("source/img/newVector"));
});

gulp.task("sprite", ["svg"], function () {
  return gulp.src("source/img/newVector/for_sprite/**/*.svg")
    .pipe(svgstore({
      inlineSvg: true
      }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/sprite"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      minifyJS: true,
      minifyURLs: true,
      collapseWhitespace: false,
      removeComments: true,
      sortAttributes: true,
      sortClassName: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png, jpg, svg, gif}")
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png, jpg}")
  .pipe(webp({quality:90}))
  .pipe(gulp.dest("source/img"));
});

gulp.task("clean", function () {
  return del(["source/img/newVector/", "build/"]);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/slick/**",
    "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("build", function (done) {
  run("clean", "copy", "sprite", "html", "style", "minify", done);
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]).on("change", server.reload);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
  gulp.watch("source/js/*.js", ["minify"]).on("change", server.reload);
});
