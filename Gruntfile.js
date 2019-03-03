module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        sourceMap: true,
        presets: [
          [
            "@babel/preset-env",
            {
              useBuiltIns: "usage"
            }
          ]
        ]
      },
      dist: {
        files: {
          "dist/main.js": "src/assets/js/*.js"
        }
      }
    },
    browserify: {
      dist: {
        files: {
          "dist/bundle.js": "dist/main.js"
        }
      }
    },
    uglify: {
      options: {
        banner:
          "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
        mangle: true,
        sourceMap: true,
        output: {
          comments: false
        }
      },
      build: {
        src: "dist/bundle.js",
        dest: "dist/bundle.min.js"
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          "dist/main.min.css": ["src/assets/css/*.css"]
        }
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
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-processhtml");

  grunt.registerTask("default", [
    "babel",
    "browserify",
    "uglify",
    "cssmin",
    "processhtml"
  ]);
};
