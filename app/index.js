'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var EzexpressGenerator = module.exports = function EzexpressGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.paths = {};
  this.paths.dev = "public";
  this.paths.dist = "build";

  this.isIIS = (options['iis']) ? true : false;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  // this.pkg = require('../package.json');

  this.on('end', function() {
    this.installDependencies();
  });

};

util.inherits(EzexpressGenerator, yeoman.generators.Base);

EzexpressGenerator.prototype.askFor = function askFor() {
  var done = this.async();

  // Have Yeoman greet the user.
  this.log(yosay(
    'Welcome to the glorious Ezexpress generator!'
  ));

  var prompts = [{
    type: 'confirm',
    name: 'useSass',
    message: 'Would you like to enable SASS css preprocessor? (Cannot disable currently)',
    default: true
  }, {
    type: 'input',
    name: 'appDir',
    message: 'What name should I give the application directory where your development files are placed?',
    default: 'public'
  }, {
    type: 'input',
    name: 'distDir',
    message: 'What name should I give the distribution directory where compiled output files are placed?',
    default: 'build'
  }];

  this.prompt(prompts, function(props) {
    this.userOpts = {};
    this.userOpts.useSass = props.useSass; // do some things with this setting
    this.userOpts.appDir = props.appDir;
    this.userOpts.distDir = props.distDir;

    this.paths.dev = props.appDir;
    this.paths.dist = props.distDir;

    done();
  }.bind(this));
};

EzexpressGenerator.prototype.app = function app() {
  this.dest.mkdir(this.paths.dev);
  this.dest.mkdir(this.paths.dev + '/js');
  if (this.userOpts.useSass === true) {
    this.dest.mkdir(this.paths.dev + '/sass');
  } else {
    this.dest.mkdir(this.paths.dev + '/styles');
  }


  this.template('.gitignore', '.gitignore');
  this.template('_package.json', 'package.json');
  this.template('heroku.js', 'heroku.js');
  this.template('web.js', 'web.js');

  this.src.copy('_bower.json', 'bower.json');
  this.src.copy('Procfile', 'Procfile');


  this.src.copy('index.html', this.paths.dev + '/index.html');
  if (this.userOpts.useSass === true) {
    this.src.copy('sass/_init.scss', this.paths.dev + '/sass/_init.scss');
    this.src.copy('sass/style.scss', this.paths.dev + '/sass/style.scss');
  } else {
    this.src.copy('styles/style.css', this.paths.dev + '/styles/style.css');
  }
  this.src.copy('js/main.js', this.paths.dev + '/js/main.js');
};

EzexpressGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js', 'Gruntfile.js');
};



EzexpressGenerator.prototype.projectfiles = function projectfiles() {
  this.src.copy('editorconfig', '.editorconfig');
  this.src.copy('jshintrc', '.jshintrc');
};
