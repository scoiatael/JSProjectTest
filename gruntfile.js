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
      common:      ['gruntfile.js', 'test/**/*.js'],
      tmp:         ['tmp/**/*.js'],
      beforebuild: ['src/**/*.js', 'spec/*.js']
    },
    react: {
      files: {
        expand: true,
        cwd: 'src/jsx/',
        src: ['**/*.jsx'],
        dest: 'tmp/',
        ext: '.js'
      }
    },
    watch: {
      jsx: {
        files: ['src/**/*.jsx'],
        tasks: ['react', 'jshint:tmp']
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
        src: ['tmp/**/*.js'],
        options: {
          specs: 'spec/**/*Spec.js',
          helpers: 'spec/**/*Helper.js'
        }
      }
    },
    symlink: {
      options: {
        overwrite:true
      },
      expanded: {
        files: [ {
          expand:true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'tmp/'
          } ]
      }
    },
    coffee: {
      options: {
        bare: true
      },
      src: {
        expand: true,
        flatten: true,
        cwd: 'src',
        src: ['*.coffee'],
        dest: 'tmp',
        ext: '.js'
      },
      tests: {
        expand: true,
        flatten: true,
        cwd: 'spec',
        src: ['*.coffee'],
        dest: 'spec/coffee/',
        ext: '.js'
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
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  // Default task(s).
  grunt.registerTask('default', ['jshint:common', 'jshint:beforebuild', 'react', 'symlink', 'coffee', 'browserify', 'uglify']);

};
