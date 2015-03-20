/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // before generating any new files, remove any previously-created files
        clean: {
            tests: ['tmp']
        },
    
        nunjucks_render: {
            options: {
                baseDir:    'test/views/',
            },
            defaults: {
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-defaults.html'
                }]
            },
            autoescape: {
                options: { autoescape: true },
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-autoescape.html'
                }]
            },
            process_data: {
                options: { processData: function(data){
                    data.username = data.username.toUpperCase();
                    return data;
                } },
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-process_data.html'
                }]
            },
            as_function: {
                options: { asFunction: true },
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-as_function.html'
                }]
            },
            extension: {
                options: { extensions: 'txt' },
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-extension.html'
                }]
            }
        },

        watch: {
            nunjucks: {
                files: 'test/views/*',
                tasks: ['nunjucks_render']
            }
        },

        // unit tests
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // actually load this plugin's task(s)
    grunt.loadTasks('tasks');

    // these plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // test a simple rendering
    grunt.registerTask('render', ['nunjucks_render']);

    // whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result
    grunt.registerTask('test', ['clean', 'nunjucks_render', 'nodeunit']);

    // by default, lint and run all tests
    grunt.registerTask('default', ['jshint', 'test']);

};
