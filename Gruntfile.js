module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig(
    { pkg: grunt.file.readJSON('package.json')
    , uglify:
      { options:
        { banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }
      , build:
        { src: 'src/<%= pkg.name %>.js'
        , dest: 'build/<%= pkg.name %>.min.js'
        }
      , backbone:
        { src: 'src/backbone.<%= pkg.name %>.js'
        , dest: 'build/backbone.<%= pkg.name %>.min.js'
        }
      }
    , jasmine:
      { core:
        { src: 'src/<%= pkg.name %>.js'
        , options:
          { specs: 'spec/<%= pkg.name %>.spec.js'
          , helpers: 'spec/helpers/*.js'
          }
        }
      , backbone:
        { src: 'src/*.js'
        , options:
          { specs: 'spec/backbone-<%= pkg.name %>.spec.js'
          , helpers: 'spec/helpers/*.js'
          , vendor: ['public/underscore-min.js', 'public/backbone-min.js']
          }
        }
      }
    });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Tasks
  grunt.registerTask('default', ['uglify']);
};
