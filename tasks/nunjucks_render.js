/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

module.exports = function gruntTask(grunt) {

    // node/external libs
    var path        = require('path'),
        nunjucks    = require('nunjucks'),
        loader      = require('../lib/loader'),
        lib         = require('../lib/lib');

    // GRUNT task "nunjucks_render"
    grunt.registerMultiTask('nunjucks_render', 'Render nunjucks templates', function () {
        // prepare task timing
        var start,
            time = function(){ return ((new Date()).getTime() - start) + "ms"; };

        // merge task-specific and/or target-specific options with these defaults
        var opts = this.options({
            name:           /(.*)/,
            searchPaths:    false,
            baseDir :       '.',
            extensions :    [ '.j2' ],
            autoescape:     false,
            watch:          true,
            asFunction:     false,
            data:           null,
            processData:    function(data){ return data; },
            env:            null
        });
        opts.extensions = lib.isArray(opts.extensions) ? opts.extensions : [opts.extensions];
        for (var i in opts.extensions) {
            if (opts.extensions[i].slice(0,1)!='.') {
                opts.extensions[i] = '.' + opts.extensions[i];
            }
        }
        if (opts.baseDir && !opts.baseDir.match(/\/$/)) {
            opts.baseDir += '/';
        }

        var nameFunc = lib.isFunction(opts.name) ? opts.name : function(filepath) {
            return filepath;
        };

        // set up Nunjucks environment
        var searchPaths = [];
        if (!opts.searchPaths) {
            grunt.log.debug(">> no 'searPaths' defined, using auto search paths (will take much longer!!!)");
            searchPaths = grunt.file.expand({filter: 'isDirectory'}, ['**', '!node_modules/**']);
        } else {
            searchPaths = grunt.file.expand(opts.searchPaths);
        }
    	var fileLoader = new loader.FileSystemLoader( searchPaths, opts.name, {
    	    baseDir:        opts.baseDir,
    	    extensions:     opts.extensions,
            autoescape:     opts.autoescape,
            watch:          opts.watch
    	});
    	var env_opts = opts.env ? [opts_env, fileLoader] : [fileLoader];
        opts.env = new nunjucks.Environment(env_opts);

        // iterate over all specified file groups
        this.files.forEach(function (f) {
            start = (new Date()).getTime();

            var fopts = lib.getData((f.options !== undefined) ? f.options : undefined);
            fopts = lib.merge(opts, fopts);

            // prepare data
            var data = lib.getData((f.data !== undefined) ? f.data : undefined);
            data = lib.merge(opts.data, data);
            if (opts.processData) {
                data = opts.processData(data);
            }
            
            // concat specified files
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set)
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('File "' + filepath + '" not found!');
                    return false;
                }
                return true;
            }).map(function(filepath) {
                var filename = filepath;
                if (filepath.substr(0, opts.baseDir.length) === opts.baseDir) {
                    filename = filepath.substr(opts.baseDir.length);
                }
                data.name = nameFunc(filename);

                if (opts.asFunction) {
                    return nunjucks.precompile(filepath, {
                        name:       nameFunc(filename),
                        asFunction: true,
                        env:        opts.env,
                        data:       data
                    });
                }

                return opts.env.render(filename, data);

            }).join('');

            // show data on debug
            if (grunt.option('debug')) {
                grunt.log.writeflags(data);
            }

            // write the destination file
            grunt.file.write(f.dest, src);

            // print a success message
            grunt.log.debug('file "' + f.dest + '" created');
            grunt.log.ok('1 file created (' + time() + ')');
        });
    });

};
