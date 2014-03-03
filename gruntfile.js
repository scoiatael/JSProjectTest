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
        src: ['src/**/<%= pkg.name %>.js', 'react/**/<%= pkg.name %>.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: 'jshintrc.json'    
      },
      common:      ['gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      react:       ['react/**/*.js'],
      beforebuild: ['src/**/*.js'],
      afterbuild:  ['build/**/*.js']
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
    }
  });

  // Load plugins that provide tasks.
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint:common', 'jshint:beforebuild', 'react', 'jshint:react', 'uglify']);

};
