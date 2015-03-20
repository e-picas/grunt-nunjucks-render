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
        nunjucks    = require('nunjucks');

    // test if obj is callable
    function isFunction(obj)
    {
        return Object.prototype.toString.call(obj) == '[object Function]';
    }

    // merge two objects with priority on second
    function merge(obj1, obj2)
    {
        var obj3 = {}, index;
        for (index in obj1) {
            obj3[index] = obj1[index];
        }
        for (index in obj2) {
            obj3[index] = obj2[index];
        }
        return obj3;
    }

    // prepare data parsing JSON or YAML file if so
    function getData(data)
    {
        var tmp_data = {};
        if (typeof(data)=='object') {
            for (var i in data) {
                if (typeof(data[i])=='string') {
                    tmp_data = merge(tmp_data, getData(data[i]));
                } else {
                    tmp_data = merge(tmp_data, data[i]);
                }
            }
        } else if (typeof(data)=='string') {
            if (/\.json/i.test(data)) {
              tmp_data = grunt.file.readJSON(data);
            } else if (/\.ya?ml/i.test(data)) {
              tmp_data = grunt.file.readYAML(data);
            }
        }
        return tmp_data;
    }

    // GRUNT task "nunjucks_render"
    grunt.registerMultiTask('nunjucks_render', 'Render nunjucks templates', function () {

        // merge task-specific and/or target-specific options with these defaults
        var opts = this.options({
                basedir :       '.',
//                extension :    '.j2',
                autoescape:     false,
                watch:          true,
                asFunction:     false,
                data:           null,
                processData:    function(data){ return data; }
            });

        var nameFunc = isFunction(opts.name) ? opts.name : function(filepath) {
            return filepath;
        };

        // setup Nunjucks views
        if (!grunt.file.exists(opts.basedir)) {
            grunt.log.warn('Views directory "' + opts.basedir + '" not found!');
            return false;
        }
        opts.abs_basedir = path.resolve(opts.basedir) + '/';
        if (grunt.option('debug')) {
            grunt.log.writeln('Setting up Nunjucks view paths to: ' + opts.abs_basedir);
        }
        nunjucks.configure(opts.abs_basedir, {
            autoescape:     opts.autoescape,
            watch:          opts.watch
        });

        // iterate over all specified file groups
        this.files.forEach(function (f) {

            var fopts = getData((f.options !== undefined) ? f.options : undefined);
            fopts = merge(opts, fopts);

            var data = getData((f.data !== undefined) ? f.data : undefined);
            data = merge(opts.data, data);
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
                if (filepath.substr(0, opts.basedir.length) === opts.basedir) {
                    filename = filepath.substr(opts.basedir.length);
                }
                data.template_name      = nameFunc(filename);
                data.template_path      = filepath;
                data.template_realpath  = opts.abs_basedir + filename;
                if (opts.asFunction) {
                    return nunjucks.precompile(filepath, data);
                }
                return nunjucks.render(filename, data);
            }).join('');

            // show data on debug
            if (grunt.option('debug')) {
                grunt.log.writeflags(data);
            }

            // write the destination file
            grunt.file.write(f.dest, src);

            // print a success message
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
