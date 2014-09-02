'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var EzexpressGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the glorious Ezexpress generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable SASS preprocessor? (Cannot disable currently)',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.dest.mkdir('public');
      this.dest.mkdir('public/js');
      this.dest.mkdir('public/sass');

      this.src.copy('_package.json', 'package.json');
      this.src.copy('_bower.json', 'bower.json');
      this.src.copy('Gruntfile.js', 'Gruntfile.js');
      this.src.copy('heroku.js', 'heroku.js');
      this.src.copy('web.js', 'web.js');
      this.src.copy('Procfile', 'Procfile');
      this.src.copy('.gitignore', '.gitignore');
      this.src.copy('index.html', 'public/index.html');
      this.src.copy('sass/style.scss', 'public/sass/style.scss');
      this.src.copy('js/main.js', 'public/js/main.js');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = EzexpressGenerator;
