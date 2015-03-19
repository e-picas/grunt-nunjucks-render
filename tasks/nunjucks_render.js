/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

module.exports = function gruntTask(grunt) {

    var path        = require('path'),
        nunjucks    = require('nunjucks'),
        lib         = require('nunjucks/src/lib');

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
                directory :     '.',
                extension :     '.j2',
                autoescape:     false,
                watch:          true,
                asFunction:     false,
                data:           null,
                processData:    function(data){ return data; }
            });

        var nameFunc = lib.isFunction(opts.name) ? opts.name : function(filepath) {
            return filepath;
        };

        if (!grunt.file.exists(opts.directory)) {
            grunt.log.warn('Views directory "' + opts.directory + '" not found!');
            return false;
        }
        opts.abs_directory = path.resolve(opts.directory) + '/';
        if (grunt.option('debug')) {
            grunt.log.writeln('Setting up Nunjucks view paths to: ' + opts.abs_directory);
        }            

        nunjucks.configure(opts.abs_directory, {
            autoescape:     opts.autoescape,
            watch:          opts.watch
        });

/*
// http://gruntjs.com/configuring-tasks#files-array-format
files: [
    {src: ['src/bb.js', 'src/bbb.js'], dest: 'dest/b/', nonull: true},
    {src: ['src/bb1.js', 'src/bbb1.js'], dest: 'dest/b1/', filter: 'isFile'},
],
*/
        this.files.forEach(function (f) {

            var fopts = getData((f.options !== undefined) ? f.options : undefined);
            fopts = merge(opts, fopts);

            var data = getData((f.data !== undefined) ? f.data : undefined);
            data = merge(opts.data, data);
            if (opts.processData) {
                data = opts.processData(data);
            }
            
            var src = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('File "' + filepath + '" not found!');
                    return false;
                }
                return true;
            }).map(function(filepath) {
                var filename = filepath;
                if (filepath.substr(0, opts.directory.length) === opts.directory) {
                    filename = filepath.substr(opts.directory.length);
                }
                data.template_name      = nameFunc(filename);
                data.template_path      = filepath;
                data.template_realpath  = opts.abs_directory + filename;
                if (opts.asFunction) {
                    return nunjucks.precompile(filename, data);
                }
                return nunjucks.render(filename, data);
            }).join('');

            if (grunt.option('debug')) {
                grunt.log.writeflags(data);
            }            
            grunt.file.write(f.dest, src);
        });
    });

};
