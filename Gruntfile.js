'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    webfont_svg_extractor: {
      test_glyphicon: {
        options: {
          fontPath: "test/fixtures/glyphicons-halflings-regular.svg",
          cssPath: "test/fixtures/bootstrap.css",
          outputDir: "tmp/",
          preset: "glyphicon"
        }
      },
      test_fontawesome: {
        options: {
          fontPath: "test/fixtures/fontawesome-webfont.svg",
          cssPath: "test/fixtures/font-awesome.css",
          outputDir: "tmp/",
          preset: "fontawesome",
          icons: [
            "smile-o",
            "frown-o",
            "male",
            "female",
          ]
        }
      }

    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'webfont_svg_extractor', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
