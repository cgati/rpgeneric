module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: [
                    'javascript/*.js',
                ],
                dest: 'javascript/app.min_concat.js'
            }
        },
        uglify: {
            options: {
                report: 'min',
                mangle: true
            },
            js: {
                src: ['javascript/app.min_concat.js'],
                dest: 'javascript/app.min.js'
            }
        },
        watch: {
            styles: {
                files: [
                    'javascript/*.js', // All JS in the libs folder
                ],
                tasks: ['concat', 'uglify'],
                /* 'less' */
                options: {
                    nospawn: true
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('default', ['concat']);
    // Might have to break this into a local file or a BuildGruntfile.js
    grunt.registerTask('default', ['watch']);
};
