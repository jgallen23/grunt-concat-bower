'use strict';

var grunt = require('grunt');

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

exports.concat_bower = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  all: function(test) {
    test.expect(2);

    var all = grunt.file.read('tmp/bower.all.js');

    var jqIndex = all.indexOf('jQuery JavaScript Library v1.10.2');
    var fidelIndex = all.indexOf('fidel - a ui view controller');
    var routieIndex = all.indexOf('routie - a tiny hash router');

    test.ok((jqIndex < fidelIndex), 'jQuery should be before fidel');
    test.ok(routieIndex, 'routie should exist');


    test.done();
  }
};
