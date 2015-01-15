/**
 * Created by dmcquillan on 8/24/14.
 */
'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ngdocs');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */\n'
        },
        clean: ["dist"],
        dirs: {
            src: 'src/main/js/**/*.js',
            dest: 'dist'
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['src/main/js/module.js', 'src/main/js/lib/*.js', 'src/main/js/directives/*.js', 'src/main/js/factories/*.js', 'src/main/js/controllers/*.js'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', '<%= dirs.src %>'],
            options: {
                curly: false,
                browser: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                expr: true,
                node: true,
                globals: {
                    exports: true,
                    angular: false,
                    google: false
                }
            }
        },
        ngdocs: {
            options: {
                dest: 'dist/docs/',
                title: 'Angular Maps Documentation',
                html5Mode: false
            },
            all: ['src/**/*.js']
        }
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify', 'ngdocs']);

};