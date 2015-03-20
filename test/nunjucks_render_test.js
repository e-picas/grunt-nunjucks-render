'use strict';

var grunt       = require('grunt');
var nunjucks    = require('nunjucks');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.nunjucks_render = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-default_options.html');
    var expected    = grunt.file.read('test/expected/template-default_options.html');
    test.equal(actual, expected, 'Parsing with default options.');
    test.done();
  },

  as_function: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-as_function.html');
    var expected    = grunt.file.read('test/expected/template-as_function.html');
    test.equal(actual, expected, 'Test of asFunction=true.');
    test.done();
  },

  opt_escape: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-opt_escape.html');
    var expected    = grunt.file.read('test/expected/template-opt_escape.html');
    test.equal(actual, expected, 'Test of auto-escape.');
    test.done();
  },

  process_data: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-process_data.html');
    var expected    = grunt.file.read('test/expected/template-process_data.html');
    test.equal(actual, expected, 'Test of data pre-processing.');
    test.done();
  }

};
