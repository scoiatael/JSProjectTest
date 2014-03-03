/*jshint node:true*/
'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['build/<%= pkg.name %>.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: 'jshintrc.json'    
      },
      common:      ['gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'JSProjectTest.js'],
      react:       ['react/**/*.js'],
      beforebuild: ['src/**/*.js', 'spec/**/*.js']
    },
    react: {
      files: {
        expand: true,
        cwd: 'src/',
        src: ['**/*.jsx'],
        dest: 'react/',
        ext: '.js'
      }
    },
    watch: {
      jsx: {
        files: ['src/**/*.jsx'],
        tasks: ['react', 'jshint:react']
      }
    },
    browserify: {
      dist: {
        files: {
          'build/<%= pkg.name %>.js': ['<%= pkg.name %>.js']
        }
      }
    },
    jasmine: {
      src: {
        src: ['src/**/*.js'],
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helper.js'
        }
      }
    }
  });

  // Load plugins that provide tasks.
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jshint:common', 'jshint:beforebuild', 'react', 'jasmine', 'jshint:react', 'browserify', 'uglify']);

};
