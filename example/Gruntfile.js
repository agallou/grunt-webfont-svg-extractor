/* global module:true */
/* global require:true */
module.exports = function (grunt) {

    grunt.initConfig({

      clean: {
        assets: {
          src: "output/"
        },
        tmp: {
          src: "tmp"
        }

      },

      bower: {
        install: {
          options: {
            copy: false
          }
        }
      },

      webfont_svg_extractor: {
        test_glyphicon: {
          options: {
            fontPath: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
            cssPath: "bower_components/bootstrap/dist/css/bootstrap.css",
            outputDir: "tmp/",
            preset: "glyphicon",
          }
        },
        test_fontawesome: {
          options: {
            fontPath: "bower_components/fontawesome/fonts/fontawesome-webfont.svg",
            cssPath: "bower_components/fontawesome/css/font-awesome.css",
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

      webfont: {
        icons: {
          src: 'tmp/*.svg',
          dest: 'output',
          destCss: 'output',
          options: {
            templateOptions: {
              baseClass: 'icon',
              classPrefix: 'icon-'
            },
            relativeFontPath: '',
            htmlDemo: true,
            engine: 'node'
          }
        }
      }, 

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-webfont-svg-extractor');
    grunt.loadNpmTasks('grunt-webfont');

    grunt.registerTask('default', [
        'clean',
        'bower',
        'webfont_svg_extractor',
        'webfont',
    ]);

};
