module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		connect: {
			app: {        
				options:{ 
					port: 8080,
          base: "app"
				}
			},
			bus: {        
				options:{ 
					port: 9080,
          base: "app/bower_components/ozp-iwc/dist/"
				}
			}		},
    'gh-pages': {
    options: {
      base: 'app'
    },
    src: ['**']
  },
  watch: {
    test: {
        files: ['Gruntfile.js', 'app/**/*'],
        tasks: ['copy'],
        options: {
            livereload: true,
            spawn: false
        }
    }
  },
  copy: {
    mockapi: {
      files: [
        {
          src: ['api/**'],
          dest: 'app/bower_components/ozp-iwc/dist/',
          cwd: 'app/bower_components/ozp-data-schemas/mock',
          expand: true,
          rename: function(dest, src) {
            return dest + src.replace(/index\.json$/, "index.html");
          }
        }
      ]
    }
  },
  shell: {
    tarDate: {
      command: [
        './packageRelease.sh demo-apps app'
      ].join('&&')
    }
  },
  clean: {
    mockapi: ['app/bower_components/ozp-iwc/dist/api']
  }
  });

	grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-shell');
	
  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'connect','watch']);

  grunt.registerTask('build', ['clean', 'copy']);

};