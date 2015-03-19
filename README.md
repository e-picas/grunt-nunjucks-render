grunt-nunjucks-render
=====================


This is a [grunt](http://gruntjs.com/) plugin to render [nunjucks](http://mozilla.github.io/nunjucks/) 
templates. It takes data in `JSON` or `YAML` format and allows you to configure *nunjucks*.


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
    options: {
      // task global options go here
    },
    your_target: {
      options: {
        // target specific options go here
      },
      files : [
        {
          data:     // path or URL to JSON or YAML file or {}
          src:      // path or URL to template file
          dest:     // path to output destination here
        }
      ]
    },
  },
})
```

See the [dedicated page](http://gruntjs.com/configuring-tasks#files-array-format) to learn
how to build your `files` objects.

#### Example

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

### Options

-   **directory**
    -   Type: `String`  
    -   Default value: `"."` (i.e. relative to your `Gruntfile.js`)
    -   Path to the directory in which partials can be found. Partials are looked up by name in this directory.

-   **extension**
    -   Type: `String`  
    -   Default value: `".j2"` (for *jinja2*)
    -   *nunjucks* will use this extension when looking up partials (if none is specified).

-   **autoescape**
    -   Type: `String`  
    -   Default value: `false`
    -   Force escaping of data while using it by *nunjucks*.

-   **watch**
    -   Type: `String`  
    -   Default value: `true`
    -   Force *nunjucks* to watch template files updates.

-   **data**
    -   Type: anything normally accepted as template's data
    -   Default value: `null`
    -   Can be used to fill in a default `data` value for any item in your `files` list. This will
        be merged with "per-file" data (which have precedence).

-   **processData**
    -   Type: `function`
    -   Default: `null`
    -   Define a function to process data for pre-compiling work.

-   **asFunction**
    -   Type: `Boolean`
    -   Default value: `false`
    -   Use this to return the raw *precompiled* version of the *nunjucks* content instead of its
        final rendering.
