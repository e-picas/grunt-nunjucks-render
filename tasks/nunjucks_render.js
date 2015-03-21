/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

// node/external libs
var path            = require('path');
var nunjucks        = require('nunjucks');
var nlib            = require('nunjucks/src/lib');
var dateFilter      = require('nunjucks-date-filter');
var loader          = require('../lib/loader');
var lib             = require('../lib/lib');
var renderFile      = require('../lib/render-file');
var renderString    = require('../lib/render-string');

// the 'nunjucks_render' grunt task
module.exports = function gruntTask(grunt) {

    grunt.registerMultiTask('nunjucks_render', 'Render nunjucks templates', function()
    {
        // prepare task vars & timing
        var start, src_counter, str_counter, result,
            time = function(){ return ((new Date()).getTime() - start) + 'ms'; };

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
            env:            null,
            strAdd:         'prepend',
            strSeparator:   "\n"
        });
        
        // be sure to have extensions as an array with leading dot
        opts.extensions = nlib.isArray(opts.extensions) ? opts.extensions : [opts.extensions];
        for (var i in opts.extensions) {
            opts.extensions[i] = lib.dotExtension(opts.extensions[i]);
        }
        
        // be sure to have baseDir with its trailing slash
        if (opts.baseDir) {
            opts.baseDir = lib.slashPath(opts.baseDir);
        }

        // the 'rename' function
        var nameFunc = nlib.isFunction(opts.name) ? opts.name : function(filepath) {
            return filepath;
        };

        // set up Nunjucks environment
        var fileLoader = new loader.FileSystemLoader(opts.searchPaths, opts.name, {
            baseDir:        opts.baseDir,
            extensions:     opts.extensions,
            autoescape:     opts.autoescape,
            watch:          opts.watch
        });
        var env_opts = opts.env ? [opts.env, fileLoader] : [fileLoader];
        opts.env = new nunjucks.Environment(env_opts);
        
        // add the date fileter to nunjucks env
        opts.env.addFilter('date', dateFilter);

        // iterate over all specified file groups
        this.files.forEach(function(file)
        {
            result      = '';
            start       = (new Date()).getTime();
            src_counter = 0;
            str_counter = 0;

            // merge options
            var fopts = lib.parseData((file.options !== undefined) ? file.options : undefined);
            fopts = lib.merge(opts, fopts);

            // prepare data
            var data = lib.parseData((file.data !== undefined) ? grunt.file.expand(file.data) : undefined);
            data = lib.merge(lib.parseData(opts.data), data);
            if (opts.processData) {
                data = opts.processData(data);
            }
            
            // re-organize strings following the strAdd option
            file.str            = nlib.isArray(file.str || []) ? (file.str || []) : [file.str];
            file.str_prepend    = nlib.isArray(file.str_prepend || []) ? (file.str_prepend || []) : [file.str_prepend];
            file.str_append     = nlib.isArray(file.str_append || []) ? (file.str_append || []) : [file.str_append];
            if (file.str!==[]) {
                if (opts.strAdd==='prepend') {
                    for (var i in file.str) {
                        file.str_prepend.push(file.str[i]);
                    }
                } else {
                    for (var i in file.str) {
                        file.str_append.unshift(file.str[i]);
                    }
                }
            }

            // show info on debug
            if (grunt.option('debug')) {
                grunt.log.writeflags(data, 'Parsing data');
                if (file.str_prepend.length>0) {
                    grunt.log.writeflags(file.str_prepend, 'Prepend strings');
                }
                if (file.str_append.length>0) {
                    grunt.log.writeflags(file.str_append, 'Append strings');
                }
            }

            // concat specified prepend strings
            if (file.str_prepend.length>0) {
                result += file.str_prepend
                    .map(function(str) {
                        str_counter++;
                        return renderString(str, data, fopts, opts.env, grunt);
                    })
                    .join(opts.strSeparator)
                    + opts.strSeparator;
            }
            
            // concat specified files
            if (file.src) {
                result += file.src
                    .filter(function(filepath) {
                        if (!grunt.file.exists(filepath)) {
                            grunt.log.warn('File "' + filepath + '" not found!');
                            return false;
                        }
                        return true;
                    })
                    .map(function(filepath) {
                        src_counter++;
                        return renderFile(filepath, data, fopts, opts.env, grunt);
                    })
                    .join('');
            }

            // concat specified append strings
            if (file.str_append.length>0) {
                result += opts.strSeparator
                    + file.str_append
                    .map(function(str) {
                        str_counter++;
                        return renderString(str, data, fopts, opts.env, grunt);
                    })
                    .join(opts.strSeparator);
            }
            
            // write the destination file
            grunt.file.write(file.dest, result);

            // print a success message
            grunt.log.debug('file "' + file.dest + '" created');
            grunt.log.ok(
                  (src_counter>0 ? src_counter + ' file(s) parsed / ' : '')
                + (str_counter>0 ? str_counter + ' string(s) parsed / ' : '')
                + '1 file created (' + time() + ')'
            );
        });

    });

};
