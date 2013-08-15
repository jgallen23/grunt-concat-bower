/*
 * grunt-concat-bower
 * https://github.com/jgallen23/grunt-concat-bower
 *
 * Copyright (c) 2013 Greg Allen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var bower = require('bower'),
      DepTree = require('deptree');

  var getPaths = function(cb) {
    bower.commands.list({ 'paths': true })
      .on('end', function(data) {
        cb(null, data);
      })
      .on('error', cb);
  };

  var getLibrariesList = function(cb) {
    bower.commands.list()
      .on('end', function(data) {
        cb(null, data);
      })
      .on('error', cb);
  };

  var createDependenciesTree = function(libraries){
    var depTree = new DepTree();

    for (var library in libraries.dependencies){
      if(libraries.dependencies[library].dependencies){
        var dependencies = [];
        for (var dependency in libraries.dependencies[library].dependencies){
          dependencies.push(dependency);
        }
        depTree.add(library,dependencies);
      }
      else {
        depTree.add(library);
      }
    }

    return depTree.resolve();
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
    var async = grunt.util.async;

    var process = function(err, results) {
      if (err){
        grunt.fail.fatal(err);
      }
      else {
        var files = results[0],
          libraries = results[1],
          dependencies = createDependenciesTree(libraries),
          concat = [];

        dependencies.forEach(function(dependency){
          if (!isExcluded(dependency) && typeof files[dependency] !== 'undefined'){
            var file = files[dependency];
            if (isOfType(file)){
              concat.push(file);
            }
          }
        });

        var out = '';
        concat.forEach(function(file){
          out += grunt.file.read(file);
        });

        grunt.file.write(dest, out);
        grunt.log.writeln(dest + ' written');

        done();
      }
    };

    async.parallel([getPaths,getLibrariesList],process);
  });
};
