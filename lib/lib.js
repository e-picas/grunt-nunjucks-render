/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

var grunt   = require('grunt');

// safely return a path with its trailing slash
module.exports.slashPath = function(path)
{
    return (path.match(/\/$/) ? path : path = '/');
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
module.exports.getData = getData;
