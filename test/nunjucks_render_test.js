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

  defaults: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-defaults.html');
    var expected    = grunt.file.read('test/expected/template-defaults.html');
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

  autoescape: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-autoescape.html');
    var expected    = grunt.file.read('test/expected/template-autoescape.html');
    test.equal(actual, expected, 'Test of auto-escape=true.');
    test.done();
  },

  extension: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-extension.html');
    var expected    = grunt.file.read('test/expected/template-extension.html');
    test.equal(actual, expected, 'Test of extension=txt.');
    test.done();
  },
  
  process_data: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-process_data.html');
    var expected    = grunt.file.read('test/expected/template-process_data.html');
    test.equal(actual, expected, 'Test of data pre-processing.');
    test.done();
  },

  multi_files: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-multi_files.html');
    var expected    = grunt.file.read('test/expected/template-multi_files.html');
    test.equal(actual, expected, 'Test of multi sources parsing.');
    test.done();
  },

  opt_data: function(test) {
    test.expect(1);
    var actual      = grunt.file.read('tmp/template-opt_data.html');
    var expected    = grunt.file.read('test/expected/template-opt_data.html');
    test.equal(actual, expected, 'Test of user data parsing.');
    test.done();
  }

};
