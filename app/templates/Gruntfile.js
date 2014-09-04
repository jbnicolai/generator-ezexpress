'use strict';
var path = require('path');

// # Folder Paths
// to match only one level down:
// 'test/spec/{,*/}*.js'
// to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  var yeomanConfig = {
    app: '<%= paths.dev %>',
    dist: '<%= paths.dist %>'
  };
  // Project configuration.
  grunt.initConfig({


    yeoman: yeomanConfig,


    // Task configuration.
    pkg: grunt.file.readJSON('package.json'),
    project: {
      app: '<%%= yeoman.app %>',
      build: '<%%= yeoman.dist %>',
      assets: '<%%= yeoman.app %>/assets',
      <% if (userOpts.useSass === true) { %>
      sass: '<%%= yeoman.app %>/sass/*.scss',
      <% } %>
      js: '<%%= yeoman.app %>/js/*.js'
    },


    useminPrepare: {
      options: {
        dest: '<%%= yeoman.dist %>'
      },
      html: ['<%%= yeoman.app %>/**/*.html']
    },
    usemin: {
      options: {
        basedir: '<%%= yeoman.dist %>',
        dirs: ['<%%= yeoman.dist %>']
      },
      html: ['<%%= yeoman.dist %>/**/*.html'],
      css: ['<%%= yeoman.dist %>/**/*.css']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%%= project.js %>'
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
        files: ['<%%= yeoman.app %>/*.html', '<%= yeoman.app %>/partials/*.html']
      },
      <% if(userOpts.useSass === true) { %>
      sass: {
        files: '<%%= project.sass %>',
        tasks: ['sass:dev', 'autoprefixer:dev']
      }, <% } %>
      js: {
        files: '<%%= project.js %>',
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
          cwd: '<%%= yeoman.app %>/assets/',
          src: ['**/*.{png,jpg,gif}'],
          extDot: 'last',
          dest: '<%%= yeoman.app %>/assets/'
        }]
      }
    },
    copy: {
      build: {
        cwd: '<%%= yeoman.app %>',
        src: ['**/*.html', '!**/sass/**'],
        dest: '<%%= yeoman.dist %>',
        expand: true
      },
    },
    clean: {
      build: {
        src: ['<%%= yeoman.dist %>']
      },
    },
    autoprefixer: {
      dev: {
        expand: true,
        cwd: '<%%= yeoman.app %>',
        src: ['styles/*.css'],
        extDot: 'last',
        dest: '<%%= yeoman.app %>'
      },
      build: {
        expand: true,
        cwd: '<%%= yeoman.dist %>',
        src: ['styles/*.css'],
        extDot: 'last',
        dest: '<%%= yeoman.dist %>'
      }
    },
    <% if (userOpts.useSass === true) { %>
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/sass',
          src: ['*.scss'],
          extDot: 'last',
          dest: '<%%= yeoman.app %>/styles',
          ext: '.css'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>/sass',
          src: ['*.scss'],
          extDot: 'last',
          dest: '<%%= yeoman.dist %>/styles',
          ext: '.css'
        }]
      }
  },
  <% } %>
    express: {
      dev: {
        options: {
          hostname: "0.0.0.0", //important
          livereload: true,
          bases: path.resolve('<%%= yeoman.app %>'),
          server: path.resolve('./web.js'),
          debug: true,
          port: 3000
        }
      }
  },
    open: {
      dev: {
        path: 'http://localhost:<%%= express.dev.options.port%>'
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    <% if (userOpts.useSass === true) { %>
    'sass:dev', <% } %>
    'autoprefixer:dev',
    'copy',
    'concat',
    'cssmin',
    'uglify',
    'usemin'
  ]);
  grunt.registerTask('serve', ['express:dev', 'open', 'watch']);
  grunt.registerTask('dev', [
    <% if (userOpts.useSass === true) { %>
    'sass:dev', <% } %>
    'autoprefixer:dev'
  ]);
};
