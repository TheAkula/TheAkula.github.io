const gulp = require("gulp");
const svgSprite = require("gulp-svg-sprite");

const config = {
  mode: {
    symbol: true,
  },
};

gulp.task("sprite", async () => {
  gulp;
  gulp
    .src("./src/assets/images/*.svg")
    .pipe(svgSprite(config))
    .pipe(gulp.dest("./src/assets/sprites/"));
});
