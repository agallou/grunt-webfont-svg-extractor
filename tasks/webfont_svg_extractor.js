'use strict';

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var xpath = require('xpath');
var css = require('css');
var qs = require('querystring');
var svgPath = require('svgpath');

module.exports = function (grunt) {

  grunt.registerMultiTask('webfont_svg_extractor', 'Split webfont SVG into separate SVG files', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      translate: "width",
      size: 1000
    });

    if (options.preset === 'glyphicon') {
       options.translate = "ascent";
       options.regexp = /.glyphicon-(.*):before/;
    } else if (options.preset === 'fontawesome') {
       options.translate = "width";
       options.regexp = /.fa-(.*):before/;
    } else if (options.preset === 'glyphicon_pro') {
       options.translate = "ascent";
       options.regexp = /.glyphicons-(.*):before/;
    }

    var requiredOptions = [
      'fontPath',
      'cssPath',
      'outputDir',
      'regexp'
    ];

    requiredOptions.forEach(function(key) {
      if (typeof options[key] === 'undefined') {
        grunt.warn('option ' + key + ' must be defined');
      }
    });

    var selectorRegexp = options.regexp;

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
    var scale = options.size / unitsPerEm;

    var iconCount = 0;

    for (var i=0; i<glyphs.length;i++) {
      var item = glyphs.item(i);
      var svgContent = new XMLSerializer().serializeToString(item);
      var path = item.getAttribute('d');
      var unicode = item.getAttribute('unicode');
      var charCode = unicode.charCodeAt(0);
      var iconName = unicodes[charCode];
      if (typeof iconName !== 'undefined') {

        if (typeof options.icons !== 'undefined' && options.icons.indexOf(iconName) === -1) {
          continue;
        }

        iconCount++;

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
          height: options.size,
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
   grunt.log.writeln('"' + iconCount + '" svg files created.');

  });

};
