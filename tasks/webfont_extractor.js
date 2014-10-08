'use strict';

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var xpath = require('xpath');
var css = require('css');
var qs = require('querystring');

module.exports = function (grunt) {

  grunt.registerMultiTask('webfont_extractor', 'Split webfont SVG into separate SVG files', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
    });

    if (typeof options.fontPath === 'undefined') {
      grunt.warn('option fontPath must be defined');
    }

    if (typeof options.outputDir === 'undefined') {
      grunt.warn('option outputDir must be defined');
    }

    var selectorRegexp = options.settings.regexp;

    var obj = css.parse(grunt.file.read(options.cssPath));
    var unicodes = {};
    var rules = obj.stylesheet.rules;
    for (var j=0; j<rules.length;j++) {
      if (rules[j].type === 'rule') {
        var rule = rules[j];
        var selector = rule.selectors[0];
        if (selector.match(selectorRegexp)) {
          var name = selector.match(selectorRegexp)[1];
          var value = rule.declarations[0].value;
          value = parseInt(value.substring(2), 16);
          unicodes[value] = name;
        }
      }
    }

    var doc = new DOMParser().parseFromString(grunt.file.read(options.fontPath), 'text/xml');

    var glyphs = doc.documentElement.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'glyph');
    for (var i=0; i<glyphs.length;i++) {
      var item = glyphs.item(i);
      var svgContent = new XMLSerializer().serializeToString(item);
      var path = item.getAttribute('d');
      var unicode = item.getAttribute('unicode');
      var charCode = unicode.charCodeAt(0);
      var iconName = unicodes[charCode];
      if (typeof iconName !== 'undefined') {
        var PIXEL = 128;
        var advWidth = 12*PIXEL;
        var template =
          '<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">' +
          '<g transform="translate({shiftX} {shiftY})">' +
          '<g transform="scale(1 -1) translate(0 -1280)">' +
          '<path d="{path}" />' +
          '</g></g>' +
          '</svg>';

        var params = {
         shiftX: -(-(14*PIXEL - advWidth)/2),
         shiftY: -(-2*PIXEL),
         width: 14*PIXEL,
         height: 14*PIXEL,
         path: path
        };

        /*jshint -W083 */
        Object.keys(params).forEach(function(key) {
          template = template.replace(new RegExp("{" + key + "}", 'g'), params[key]);
        });

        var outFilepath = options.outputDir + iconName + '.svg';
        grunt.file.write(outFilepath, template);
      }
    }
   grunt.log.writeln('"' + i + '" svg files created.');

  });

};
