module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        presets: ["@babel/preset-env"]
      },
      dist: {
        files: {
          "dist/main.js": "src/assets/js/*.js"
        }
      }
    },
    uglify: {
      options: {
        banner:
          "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
        mangle: true,
        output: {
          comments: false
        }
      },
      build: {
        src: "dist/main.js",
        dest: "dist/main.min.js"
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require("precss")(),
          require("autoprefixer")({ browsers: "last 2 versions" }),
          require("cssnano")({
            preset: [
              "default",
              {
                discardComments: {
                  removeAll: true
                }
              }
            ]
          })
        ]
      },
      dist: {
        src: "src/assets/css/main.css",
        dest: "dist/main.min.css"
      }
    },
    processhtml: {
      updateScriptLinks: {
        files: {
          "dist/index.html": ["./src/index.html"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-processhtml");

  grunt.registerTask("default", ["babel", "uglify", "postcss", "processhtml"]);
};
