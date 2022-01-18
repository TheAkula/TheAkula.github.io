const gulp = require("gulp");
const svgSprite = require("gulp-svg-sprite");

const config = {
  mode: {
    css: {
      // Activate the «css» mode
      render: {
        css: true, // Activate CSS output (with default options)
      },
    },
  },
};

gulp.task("sprite", async () => {
  gulp;
  gulp
    .src("./src/assets/images/*.svg")
    .pipe(svgSprite(config))
    .pipe(gulp.dest("./src/assets/sprites/"));
});
