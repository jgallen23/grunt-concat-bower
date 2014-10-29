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
    bower.commands.list({ json: true }, { offline: true })
      .on('end', function(data) {
        cb(null, data);
      })
      .on('error', cb);
  };
  var getPaths = function(cb) {
    bower.commands.list({ paths: true }, { offline: true })
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

  var getFile = function(main, type) {
    var files = main.split(',');
    var filter = files.filter(function(item) {
      return (item.indexOf(type) !== -1);
    });

    return (filter.length !== 0) ? filter[0] : null;
  };

  grunt.registerMultiTask('bower', 'A grunt plugin to concat bower dependencies', function() {
    var type = this.data.type || '.js';
    var exclude = this.data.exclude || [];
    var overridePaths = this.data.paths || {};
    var additionalDeps = this.data.additionalDeps || {};
    var dest = this.data.dest;
    var async = grunt.util.async;

    var done = this.async();

    var process = function(err, results) {
      if (err){
        grunt.fatal(err);
      }
      else {
        var paths = results[0];
        var sources = results[1].dependencies;
        var devDeps = results[1].pkgMeta.devDependencies;

        //remove dev deps
        for (var key in devDeps) {
          delete sources[key];
        }

        var deptree = new DepTree();

        getDeps(false, sources, deptree);
        if (additionalDeps) {
          for (var key in additionalDeps) {
            deptree.add(key, additionalDeps[key]);
          }
        }
        var deps = deptree.resolve();

        var out = '';

        deps.forEach(function(dep){
          var file = overridePaths[dep] || paths[dep];
          file = getFile(file, type);

          if (!file) {
            grunt.log.writeln('Not including ' + dep + ' because doesn\'t match file type');
          } else if (!fs.existsSync(file) || fs.lstatSync(file).isDirectory()) {
            grunt.log.error('Not including '+ dep + ' because main is not set');
          } else if (exclude.indexOf(dep) !== -1) {
            grunt.log.writeln('Skipping '+ dep +' ('+file+')');
          } else {
            grunt.log.writeln('Including '+ dep + ' ('+file+')');
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
