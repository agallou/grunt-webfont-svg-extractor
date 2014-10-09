'use strict';

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var xpath = require('xpath');
var css = require('css');
var qs = require('querystring');
var svgPath = require('svgpath');

module.exports = function (grunt) {

  grunt.registerMultiTask('webfont_extractor', 'Split webfont SVG into separate SVG files', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      translate: "width",
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

    var fontFace = doc.documentElement.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'font-face').item(0);
    var unitsPerEm = fontFace.getAttribute('units-per-em');

    var fontHorizAdvX = doc.documentElement.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'font').item(0).getAttribute('horiz-adv-x');

    var descent = fontFace.getAttribute('descent');
    var ascent = fontFace.getAttribute('ascent');

    var missingGlyph = doc.documentElement.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'missing-glyph').item(0);
    var defaultHorizAdvX = missingGlyph.getAttribute('horiz-adv-x');

    var glyphs = doc.documentElement.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'glyph');
    var scale = 1000 / unitsPerEm;

    for (var i=0; i<glyphs.length;i++) {
      var item = glyphs.item(i);
      var svgContent = new XMLSerializer().serializeToString(item);
      var path = item.getAttribute('d');
      var unicode = item.getAttribute('unicode');
      var charCode = unicode.charCodeAt(0);
      var iconName = unicodes[charCode];
      if (typeof iconName !== 'undefined') {
        var template =
          '<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="{d}" />' +
          '</svg>';

        var horizAdvX = item.getAttribute('horiz-adv-x');
        var width = horizAdvX || fontHorizAdvX;
        var translateValue = options.translate === 'width' ? -ascent : -width;

        var d = new svgPath(path)
          .translate(0, translateValue)
          .scale(scale, -scale)
          .abs()
          .round(1)
          .rel()
          .round(1)
          .toString()
        ;
        
        var params = {
          width: (width*scale).toFixed(1),
          height: 1000,
          d: d
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
