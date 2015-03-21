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

// nunjucksRenderString ( str , data , options , nunjucks_env , grunt )
module.exports = function nunjucksRenderString(str, data, options, nunjucks_env, grunt)
{
    var data    = data || {};
    var options = options || {};
    var env     = nunjucks_env || nunjucks.configure();
    var grunt   = grunt || require('grunt');

    var result;
    grunt.verbose.write('Parsing string of length ' + str.length + ' ...');
    if (options.asFunction) {
        result = nunjucks.precompileString(str, {
            asFunction: true,
            env:        env,
            data:       data
        });
    } else {
        result = env.renderString(str, data);
    }

    grunt.verbose.ok();
    return result;
};
