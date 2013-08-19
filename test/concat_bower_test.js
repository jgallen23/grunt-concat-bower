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
    test.expect(6);

    var all = grunt.file.read('tmp/bower.all.js');

    //jquery, fittext, fidel, fidel-template, weekly

    var jqIndex = all.indexOf('jQuery JavaScript Library v1.10.2');
    var fitIndex = all.indexOf('FitText.js 1.1');
    var fidelTmpIndex = all.indexOf('fidel-template - A fidel plugin to render a clientside template');
    var fidelIndex = all.indexOf('fidel - a ui view controller');
    var weeklyIndex = all.indexOf('weekly - jQuery Weekly Calendar Plugin');
    var templateIndex = all.indexOf('template - A simple javascript template engine.');
    var obanIndex = all.indexOf('oban - a set of less mixins that give you a starting point when starting a new project');

    test.ok((jqIndex < fitIndex), 'jQuery should be before fit');
    test.ok((fitIndex < fidelIndex), 'fit should be before fidel');
    test.ok((templateIndex < fidelTmpIndex), 'template should be before fidel template');
    test.ok((fidelIndex < fidelTmpIndex), 'fidel should be before fidel template');
    test.ok((weeklyIndex > fidelTmpIndex), 'fidel template should be before weekly');
    test.equal(obanIndex, -1, 'Oban shouldn\'t be included since less files doesn\'t match file type');

    test.done();
  },
  exclude: function(test) {
    test.expect(5);

    var all = grunt.file.read('tmp/bower.js');

    var jqIndex = all.indexOf('jQuery JavaScript Library v1.10.2');
    var fitIndex = all.indexOf('FitText.js 1.1');
    var fidelTmpIndex = all.indexOf('fidel-template - A fidel plugin to render a clientside template');
    var fidelIndex = all.indexOf('fidel - a ui view controller');
    var weeklyIndex = all.indexOf('weekly - jQuery Weekly Calendar Plugin');
    var obanIndex = all.indexOf('oban - a set of less mixins that give you a starting point when starting a new project');

    test.equal(jqIndex, -1, 'jQuery should not exist');
    test.equal(obanIndex, -1, 'Oban shouldn\'t be included since less files doesn\'t match file type');
    test.ok((fitIndex < fidelIndex), 'fit should be before fidel');
    test.ok((fidelIndex < fidelTmpIndex), 'fidel should be before fidel template');
    test.ok((weeklyIndex > fidelTmpIndex), 'fidel template should be before weekly');

    test.done();
  }

};
