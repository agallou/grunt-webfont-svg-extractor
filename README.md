# grunt-webfont-svg-extractor

> Split webfont SVG into separate SVG files

This plugins takes a webfont SVG file and it's associated CSS file and generates one SVG file per icon.

Could be used in association with the [Webfont](https://www.npmjs.org/package/grunt-webfont) plugin to pick some icons from multiple librairies and put them in the same webfont (you can check out an example [here](https://github.com/agallou/grunt-webfont-svg-extractor/tree/master/example).

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-webfont-svg-extractor --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-webfont-svg-extractor');
```

## The "webfont_extractor" task

## Example

The task will take 2 files : 

* `glyphicons-halflings-regular.svg`
* `bootstrap.css`

And generate multiple files :

* `zoom-out.svg`
* `zoom-in.svg`
* `wrench.svg`
* `warning-sign.svg`
* ...

### Overview
In your project's Gruntfile, add a section named `webfont_extractor` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  webfont_svg_extractor: {
    options: {
      fontPath: "test/fixtures/glyphicons-halflings-regular.svg",
      cssPath: "test/fixtures/bootstrap.css",
      outputDir: "tmp/",
      preset: "glyphicon"
    }
  },
})
```

### Options

#### options.fontPath
Type: `String`

Path to the original webfont.

#### options.cssPath
Type: `String`

Path to the associated CSS file.

#### options.outputDir
Type: `String`

Directory to put the generated SVG files.

#### options.preset
Type: `String`
Values: `glyphicon` or `fontawesome` or `glyphicon_pro` or `undefined`

Which font is is used. If none advanced options must be defined.

### Advanced options

Those options are defined when the `preset` option has been set. You only need to use them if you want to use a font that is not in the presets.

#### options.size
Type: `Int`
Default : 1000

Size of the generated SVG file. Usefull when you have cutom SVG icons that you want to merge in one font file (all font must have the same size).

#### options.regexp
Type: `Regexp`

Regexp to limit the list of CSS selectors (webfont-svg-extractor uses the CSS file to match the Unicode Private Use Area characters and find the associated classname) and the part of the classname used to generate the SVG filename.

#### options.translate
Type: `String`
Values: `width` or `ascent`

Internal usage.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### 0.0.4

* fix `glyphicon_pro` configuration

### 0.0.3

* add `glyphicon_pro` preset
* add size option

## License
Copyright (c) 2014 . Licensed under the MIT license.
