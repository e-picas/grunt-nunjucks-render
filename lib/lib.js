/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

var grunt   = require('grunt');
var nlib    = require('nunjucks/src/lib');

// safely return a path with its trailing slash
module.exports.slashPath = function(path)
{
    return (path.match(/\/$/) ? path : path + '/');
};

// safely return an extension with its leading dot
module.exports.dotExtension = function(ext)
{
    return (ext.slice(0,1)=='.' ? ext : '.' + ext);
};

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
module.exports.merge = merge;

// prepare data parsing JSON or YAML file if so
function parseData(data)
{
    var tmp_data = {};
    if (nlib.isString(data)) {
        if (/\.json/i.test(data) && grunt.file.exists(data)) {
          tmp_data = grunt.file.readJSON(data);
        } else if (/\.ya?ml/i.test(data) && grunt.file.exists(data)) {
          tmp_data = grunt.file.readYAML(data);
        } else {
            tmp_data = data;
        }
    } else if (nlib.isObject(data) || nlib.isArray(data)) {
        for (var i in data) {
            if (nlib.isString(data[i])) {
                var parsed = parseData(data[i]);
                if (nlib.isString(parsed)) {
                    tmp_data[i] = parsed;
                } else {
                    tmp_data = merge(tmp_data, parsed);
                }
            } else {
                tmp_data = merge(tmp_data, data[i]);
            }
        }
    }
    return tmp_data;
}
module.exports.parseData = parseData;
