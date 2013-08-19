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
  var DepTree = require('deptree');
  var fs = require('fs');

  var getList = function(cb) {
    bower.commands.list({ offline: true, json: true })
      .on('end', function(data) {
        cb(null, data);
      })
      .on('error', cb);
  };
  var getPaths = function(cb) {
    bower.commands.list({ 'paths': true })
      .on('end', function(data) {
        cb(null, data);
      })
      .on('error', cb);
  };

  var getDeps = function(name, deps, deptree) {
    if (name) {
      deptree.add(name, Object.keys(deps));
    }
    for (var depname in deps) {
      getDeps(depname, deps[depname].dependencies, deptree);
    }
  };

  grunt.registerMultiTask('bower', 'A grunt plugin to concat bower dependencies', function() {
    var type = this.data.type || '.js';
    var exclude = this.data.exclude || [];
    var dest = this.data.dest;
    var async = grunt.util.async;

    var done = this.async();

    var process = function(err, results) {
      var paths = results[0];
      var sources = results[1].dependencies;

      var deptree = new DepTree();

      if (err){
        grunt.fail.fatal(err);
      }
      else {
        getDeps(false, sources, deptree);
        var deps = deptree.resolve();

        var out = '';
        deps.forEach(function(dep){
          var file = paths[dep];

          if (!fs.existsSync(file) || fs.lstatSync(file).isDirectory()) {
            grunt.log.error('Not including '+ file + ' because main is not set');
          }
          else if (exclude.indexOf(dep) !== -1) {
            grunt.log.writeln('Skipping '+ file);
          } else {
            grunt.log.writeln('Including '+file);
            out += grunt.file.read(file);
          }
        });

        grunt.file.write(dest, out);
        grunt.log.writeln(dest + ' written');
        done();
      }
    };
    async.parallel([getPaths, getList], process);

  });

};
