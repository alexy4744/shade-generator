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
    cssmin: {
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
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-processhtml");

  grunt.registerTask("default", ["babel", "uglify", "cssmin", "processhtml"]);
};
