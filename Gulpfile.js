const del = require("del");
const fs = require("fs");
const { Transform } = require("stream");
const childProcess = require("child_process");
const gulp = require("gulp");
const gulpStep = require("gulp-step");
const util = require("gulp-util");

gulpStep.install();

// Build
gulp.task("clean-lib", () => {
  return del(["./lib"]);
});

gulp.step("client-scripts-bundle", () => {
  return childProcess
    .spawn("pnpm rollup -c", { shell: true, stdio: "inherit" });
});

gulp.step("client-scripts-processing", async () => {
  const wrapper_code = `
      (function initHammerheadClient () {
          {{{source}}}
      })();

      window['%hammerhead%'].utils.removeInjectedScript();
    `.trim();

  const non_minifed_path = "./lib/client/hammerhead.js";
  const minifed_path = "./lib/client/hammerhead.min.js";

  const non_minifed_src = await fs.promises.readFile(non_minifed_path, { encoding: "utf-8" });
  const minifed_src = await fs.promises.readFile(minifed_path, { encoding: "utf-8" });

  await fs.promises.writeFile(non_minifed_path, wrapper_code.replace("{{{source}}}", non_minifed_src), { encoding: "utf-8" });
  await fs.promises.writeFile(minifed_path, wrapper_code.replace("{{{source}}}", minifed_src), { encoding: "utf-8" });
});

// TODO: get rid of this step when we migrate to proper ES6 default imports
gulp.step("server-scripts-add-exports", () => {
  const transform = new Transform({
    objectMode: true,

    transform (file, enc, cb) {
      const fileSource = file.contents.toString();

      if (fileSource.includes("exports.default =")) {
        const sourceMapIndex = fileSource.indexOf("//# sourceMappingURL");
        const modifiedSource = fileSource.slice(0, sourceMapIndex) + "module.exports = exports.default;\n" + fileSource.slice(sourceMapIndex);

        file.contents = Buffer.from(modifiedSource);
      }

      cb(null, file);
    }
  });

  return gulp
    .src([
      "lib/**/*.js",
      "!lib/client/**/*.js"
    ])
    .pipe(transform)
    .pipe(gulp.dest("lib"));
});

gulp.step("server-scripts", () => {
  const generateSourceMap = util.env.dev ? "--inlineSourceMap true" : "";

  return childProcess
    .spawn(`pnpm tsc -p tsconfig.json ${generateSourceMap}`, { shell: true, stdio: "inherit" });
});

gulp.step("templates", () => {
  return gulp
    .src("./src/client/task.js.mustache", { silent: false })
    .pipe(gulp.dest("./lib/client"));
});

gulp.task("build",
  gulp.series(
    "clean-lib",
    "server-scripts",
    "server-scripts-add-exports",
    "client-scripts-bundle",
    "client-scripts-processing",
    "templates"
  )
);
