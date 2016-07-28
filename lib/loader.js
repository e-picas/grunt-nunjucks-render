/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 *
 * This is largely inspired by <https://github.com/adiktofsugar/grunt-nunjucks-alt/blob/master/lib/loaders.js>.
 */

'use strict';

var fs          = require('fs');
var path        = require('path');
var nunjucks    = require('nunjucks');
var nlib        = require('nunjucks/src/lib');
var loader      = require('nunjucks/src/loader');
var grunt       = require('grunt');
var lib         = require('./lib');

var FileSystemLoader = loader.extend({
    init: function(searchPaths, name, options) {
        this.pathsToNames   = {};
        this.name           = name;

        options = options || {};
        if (options.baseDir) {
            options.baseDir = lib.slashPath(options.baseDir);
        }
        this.options = options;

        if (!name) {
            throw new Error("You must provide a name for the FileSystemLoader");
        }

        if (searchPaths) {
            if (!nlib.isArray(searchPaths)) {
                searchPaths = [searchPaths];
            }
            this.searchPaths = searchPaths.map(path.normalize);
        } else {
            grunt.log.debug('>> no "searchPaths" defined, using auto search paths (will take much longer!!!)');
            this.searchPaths = ['.'];
        }
    },

    resolveFilepathToName: function (filepath) {
        var name = this.name;
        var resolvedName;

        // remove the baseDir part from the name resolution
        var baseDir = this.options.baseDir;
        if (baseDir) {
            if (filepath.substring(0, baseDir.length) === baseDir) {
                var oldfilepath = filepath;
                filepath = filepath.substring(baseDir.length);
            }
        }

        if (name instanceof RegExp) {
            var nameParts = filepath.match(name);
            if (!nameParts) {
                return false;
            }
            resolvedName = nameParts.slice(1).join('');
        } else if (name instanceof Function) {
            resolvedName = name(filepath);
        } else {
            throw new Error('Name must be a RegExp or a Function.');
        }

        return resolvedName;
    },

    getSource: function(name, ext) {
        var fullpath    = null;
        var searchPaths = this.searchPaths;
        var extensions  = this.options.extensions || [];
        var baseDir     = this.options.baseDir;

        // first in baseDir
        if (baseDir && fs.existsSync(baseDir + name)) {
            fullpath = baseDir + name;

        } else {
            // then in all searchPaths
            searchPathsLoop:
            for(var i=0; i<searchPaths.length; i++) {
                var stats = fs.statSync(searchPaths[i]);
                if (!stats.isDirectory()) {
                    continue;
                }

                var allPaths = fs.readdirSync(searchPaths[i]);
                for (var j =0; j<allPaths.length; j++) {
                    var resolvedAllPath = path.join(searchPaths[i], allPaths[j]);
                    if (this.resolveFilepathToName(resolvedAllPath) === name) {
                        fullpath = resolvedAllPath;
                        break searchPathsLoop;
                    }
                }
            }
        }

        if (!fullpath) {
            for (var k in extensions) {
                if (extensions[k]!==ext && name.slice(-(extensions[k].length)) !== extensions[k]) {
                    var source = this.getSource( name + extensions[k], extensions[k] );
                    if (source) {
                        return source;
                    }
                }
            }
            return null;
        }

        this.pathsToNames[fullpath] = name;

        var env = nunjucks.configure();
        env.addGlobal('template_path', fullpath);

        return { src: fs.readFileSync(fullpath, 'utf-8'),
                 path: fullpath,
                 noCache: true };
    }
});

module.exports.FileSystemLoader = FileSystemLoader;
