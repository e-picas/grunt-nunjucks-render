/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

// node/external libs
var nunjucks    = require('nunjucks');
var nlib        = require('nunjucks/src/lib');

// nunjucksRenderFile ( filepath , data , options , nunjucks_env , grunt )
module.exports = function nunjucksRenderFile(filepath, data, options, nunjucks_env, grunt)
{
    data    = data || {};
    options = options || {};
    grunt   = grunt || require('grunt');
    var env = nunjucks_env || nunjucks.configure();

    if (filepath===undefined || !grunt.file.exists(filepath)) {
        throw new Error('File "' + filepath + '" not found!');
    }

    var filename = filepath;
    if (filepath.substr(0, options.baseDir.length) === options.baseDir) {
        filename = filepath.substr(options.baseDir.length);
    }

    var nameFunc = nlib.isFunction(options.name) ? options.name : function(filepath) {
        return filepath;
    };
    data.name = nameFunc(filename);

    var result;
    grunt.verbose.write('Parsing ' + filepath + ' ...');
    if (options.asFunction) {
        result = nunjucks.precompile(filepath, {
            name:       nameFunc(filename),
            asFunction: true,
            env:        env,
            data:       data
        });
    } else {
        result = env.render(filename, data);
    }

    grunt.verbose.ok();
    return result;
};
