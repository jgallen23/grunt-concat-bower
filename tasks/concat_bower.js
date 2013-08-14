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
      .on('end', function(data) {
        cb(null, data);
      })
      .on('error', cb);
  };

  grunt.registerMultiTask('bower', 'A grunt plugin to concat bower dependencies', function() {
    var type = this.data.type || '.js';
    var exclude = this.data.exclude || [];
    var dest = this.data.dest;

    var isOfType = function(file){
      return file.indexOf(type) !== -1;
    },
    isExcluded = function(library){
      return exclude.indexOf(library) !== -1;
    };

    var done = this.async();

    var process = function(err, sources) {
      if (err){
        grunt.fail.fatal(err);
      }
      else {
        var files = [];
        for(var source in sources){
          if (isOfType(sources[source]) && !isExcluded(source)){
            files.push(sources[source]);
          }
        }

        var out = '';
        files.forEach(function(file){
          out += grunt.file.read(file);
        });

        grunt.file.write(dest, out);
        grunt.log.writeln(dest + ' written');
        done();
      }
    };
    getPaths(process);
  });

};
