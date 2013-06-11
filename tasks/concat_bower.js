/*
 * grunt-concat-bower
 * https://github.com/jgallen23/grunt-concat-bower
 *
 * Copyright (c) 2013 Greg Allen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var bower = require('bower');

  var getPaths = function(cb) {
    bower.commands.list({ 'paths': true })
      .on('data', function(data) {
        cb(null, data);
      });
  };

  var getSources = function(cb) {
    bower.commands.list({ 'sources': true })
      .on('data', function(data) {
        cb(null, data);
      });
  };

  grunt.registerMultiTask('bower', 'A grunt plugin to concat bower dependencies', function() {

    var type = this.data.type || '.js';
    var exclude = this.data.exclude || [];
    var dest = this.data.dest;

    var done = this.async();
    var async = grunt.util.async;
    var self = this;

    var process = function(err, results) {
      var paths = results[0];
      var sources = results[1][type];

      exclude.forEach(function(exclude) {
        var index = sources.indexOf(paths[exclude]);
        if (index == -1) {
          grunt.log.error(exclude + ' doesn\'t exist');
        }
        sources.splice(index, 1);
      });

      var out = '';
      sources.forEach(function(source) {
        out += grunt.file.read(source);
      });
      grunt.file.write(dest, out);
      grunt.log.writeln(dest + ' written');
      done();
    };

    async.parallel([getPaths, getSources], process);


  });

};
