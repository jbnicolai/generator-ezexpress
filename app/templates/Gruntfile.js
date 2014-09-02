'use strict';
var path = require('path');
/*global module:false*/
module.exports = function(grunt) {

  var yeomanConfig = {
    app: '<%= paths.dev %>',
    dist: '<%= paths.dist %>',
    siteUrl: '<%= userOpts.siteURL %>',
    devURL: '<%= userOpts.devURL %>',
    devPort: '<%= userOpts.devPort %>'
  };
  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    //Todo: Add usemin
    pkg: grunt.file.readJSON('package.json'),
    project: {
      build: 'build',
      src: 'public',
      assets: '<%= project.src %>/assets',
      sass: '<%= project.src %>/sass/*.scss',
      js: '<%= project.src %>/js/*.js'
    },
    useminPrepare: {
      options: {
        dest: '<%= project.build %>'
      },
      html: ['<%= project.src %>/**/*.html']
    },
    usemin: {
      options: {
        basedir: '<%= project.build %>',
        dirs: ['<%= project.build %>']
      },
      html: ['<%= project.build %>/**/*.html'],
      css: ['<%= project.build %>/**/*.css']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= project.js %>'
      ]
    },
    watch: {
      options: {
        livereload: true,
      },
      grunt: {
        files: 'Gruntfile.js',
      },
      html: {
        files: ['<%= project.src %>/*.html', '<% project.src %>/partials/*.html']
      },
      sass: {
        files: '<%= project.sass %>',
        tasks: ['sass:dev', 'autoprefixer:dev']
      },
      js: {
        files: '<%= project.js %>',
        tasks: ['jshint:all']
      },
      backend: {
        files: 'web.js',
        tasks: ['express:dev']
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>/assets/',
          src: ['**/*.{png,jpg,gif}'],
          extDot: 'last',
          dest: '<%= project.src %>/assets/'
        }]
      }
    },
    copy: {
      build: {
        cwd: '<%= project.src %>',
        src: ['**/*.html', '!**/sass/**'],
        dest: '<%= project.build %>',
        expand: true
      },
    },
    clean: {
      build: {
        src: ['<%= project.build %>']
      },
    },
    autoprefixer: {
      dev: {
        expand: true,
        cwd: '<%= project.src %>',
        src: ['styles/*.css'],
        extDot: 'last',
        dest: '<%= project.src %>'
      },
      build: {
        expand: true,
        cwd: '<%= project.build %>',
        src: ['styles/*.css'],
        extDot: 'last',
        dest: '<%= project.build %>'
      }
    },
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>/sass',
          src: ['*.scss'],
          extDot: 'last',
          dest: '<%= project.src %>/styles',
          ext: '.css'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%= project.build %>/sass',
          src: ['*.scss'],
          extDot: 'last',
          dest: '<%= project.build %>/styles',
          ext: '.css'
        }]
      }
    },
    express: {
      dev: {
        options: {
          hostname:"0.0.0.0", //important
          livereload: true,
          bases: path.resolve('<%= project.src %>'),
          server: path.resolve('./web.js'),
          debug: true,
          port: 3000
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:<%= express.dev.options.port%>'
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('build', ['clean', 'useminPrepare', 'sass:dev', 'autoprefixer:dev',
    'copy',
    'concat',
    'cssmin',
    'uglify', 'usemin']);
  grunt.registerTask('serve', ['express:dev', 'open', 'watch']);
  grunt.registerTask('dev', ['sass:dev', 'autoprefixer:dev']);
};
