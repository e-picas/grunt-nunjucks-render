/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

var moment  = require('moment');
var nlib    = require('nunjucks/src/lib');

// a date filter for Nunjucks
// usage: {{ my_date | date(format) }}
// see: <http://momentjs.com/docs/>
function dateFilter(date, format)
{
    var result;
    var errs = [];
    var args = arguments;

    try {
        var obj = moment(date);
    } catch (err) {
        errs.push(err);
    }

    if (obj) {
        try {
            if (obj[format] && nlib.isFunction(obj[format])) {
                result = obj[format].apply(obj, args.slice(2));
            } else {
                result = obj.format(format);
            }
        } catch(err) {
            errs.push(err);
        }
    }

    if (errs.length) {
        return errs.join("\n");
    }
    return result;
}

module.exports = dateFilter;
