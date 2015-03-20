grunt-nunjucks-render
=====================

[![Build Status](https://travis-ci.org/piwi/grunt-nunjucks-render.svg?branch=master)](https://travis-ci.org/piwi/grunt-nunjucks-render)

This is a [grunt](http://gruntjs.com/) plugin to render [nunjucks](http://mozilla.github.io/nunjucks/) 
templates. It takes data in `JSON` or `YAML` format and allows to configure *nunjucks* in
*Grunt* tasks.


Getting Started
---------------

This plugin requires Grunt `~0.4.1`.

Please first have a look at the [Getting Started](http://gruntjs.com/getting-started) guide of Grunt. 

You may install this plugin with this command:

```shell
npm install grunt-nunjucks-render --save-dev
```

Once the plugin is installed, it may be enabled inside your `Gruntfile.js` with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nunjucks-render');
```


The "nunjucks_render" task
--------------------------

### Overview

In your project's Gruntfile, add a section named `nunjucks_render` to the data object 
passed into `grunt.initConfig()`:

```js
grunt.initConfig({
  nunjucks_render: {
    options: {},    // task global options go here
    your_target: {
      options: {},  // target specific options go here
      files : [
        {
          data:     // path or URL to JSON or YAML file or {}
          src:      // path or URL to template file
          dest:     // path to output destination here
        }
      ]
    }
  }
});
```

See the [dedicated page](http://gruntjs.com/configuring-tasks#files-array-format) to learn
how to build your `files` objects.

### Environment

A special [environment loader](http://mozilla.github.io/nunjucks/api.html#loader) is designed
by the plugin to use the full set of options when searching templates (original parsed ones
and included ones). The loader is defined in `lib/loader.js`.

The `template_path` environment variable will always contain the path of the current parsed
template (the current file), even for inclusions.

### Options

Options can be define globally for the `nunjucks_render` task or for each target.
The target options will always overload global settings.

A "*template*" here is a raw template, defined as the `src` item of a target files, or a
*nunjucks* included template.

-   **searchPaths**
    -   Type: `String`,`Array`  
    -   Default value: `"."` (i.e. relative to your `Gruntfile.js`)
    -   One or more paths to be scanned by the template loader while searching *nunjucks* templates.
        By default, the loader will search in **all** directories of the root directory. If `baseDir`
        is defined and the template is found in it, this file will be used.

-   **baseDir**
    -   Type: `String`  
    -   Default value: `"."` (i.e. relative to your `Gruntfile.js`)
    -   Path to the directory in which *nunjucks* will search templates.

-   **extensions**
    -   Type: `String`,`Array`  
    -   Default value: `".j2"` (for *jinja2*)
    -   One or more file extensions to use by the template loader while searching *nunjucks* templates.

-   **autoescape**
    -   Type: `String`  
    -   Default value: `false`
    -   Force data escaping by *nunjucks*.

-   **watch**
    -   Type: `String`  
    -   Default value: `true`
    -   Force *nunjucks* to watch template files updates.

-   **data**
    -   Type: `object`, filename or array of filenames
    -   Default value: `null`
    -   Can be used to fill in a default `data` value for a whole task or a target. This will
        be merged with "per-file" data (which have precedence).

-   **processData**
    -   Type: `function`
    -   Default: `null`
    -   Define a function to transform data as a pre-compilation process (before to send them
        to *nunjucks*).

-   **asFunction**
    -   Type: `Boolean`
    -   Default value: `false`
    -   Use this to return the raw *precompiled* version of the *nunjucks* content instead of its
        final rendering.

-   **env**
    -   Type: `nunjucks.Environment` (see <http://mozilla.github.io/nunjucks/api.html#environment>)
    -   Default value: `null`
    -   A custom *nunjucks* environment to use for compilation.

#### Examples

Define a base path for all parsed files:

```js
options: {
    baseDir: 'templates/to/read/'
},
files: {
    'file/to/output-1.html': 'file-1.j2',
    'file/to/output-2.html': 'file-2.j2',
    'file/to/output-3.html': 'file-3.j2'
}
```

Define a global `data` table for all parsed files:

```js
options: {
    data: {
        name: "my name",
        desc: "my description"
    }
},
files: {
    'file/to/output.html': 'template/to/read.j2'
}
```

Define a global JSON data file for all parsed files:

```js
options: {
    data: 'commons.json'
},
files: {
    'file/to/output-1.html': 'template/to/read-1.j2',
    'file/to/output-2.html': 'template/to/read-2.j2',
    'file/to/output-3.html': 'template/to/read-3.j2'
}
```

Define a global `data` table for all targets, over-written by a "per-target" data:

```js
options: {
    data: {
        name: "my name",
        desc: "my description"
    }
},
my_target: {
    files: {
        data:   { desc: "my desc which will over-write global one" }
        src:    'template/to/read.j2'
        dest:   'file/to/output.html'
    }
}
```

Define a full set of [grunt files](http://gruntjs.com/configuring-tasks#files-array-format):

```js
files: [
  {
    expand: true,
    src: 'template/to/read-*.j2',
    data: 'common-data.json',
    dest: 'dest/directory/'
  }
]
```


Related third-parties links
---------------------------

-   [Grunt](http://gruntjs.com/), a task runner
-   [Nunjucks](http://mozilla.github.io/nunjucks/), a templating engine for JavaScript
-   [Jinja2](http://jinja.pocoo.org/), the first inspiration of *Nunjucks*
-   [JSON](http://json.org/), the *JavaScript Object Notation*
-   [YAML](http://yaml.org/), a human friendly data serialization


Contributing
------------

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit 
tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
