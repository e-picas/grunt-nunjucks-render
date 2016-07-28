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
            },
            multi_files: {
                options: { extensions: 'txt' },
                files : [{
                    src:        [ 'test/views/template.j2', 'test/views/template-partial.j2'],
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-multi_files.html'
                }]
            },
            opt_data: {
                options: { data: { "username_user": "my username" } },
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-opt_data.html'
                }]
            },
            files_data: {
                options: { data: [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ] },
                files : [{
                    src:        'test/views/template.j2',
                    dest:       'tmp/template-files_data.html'
                }]
            },
            string_content: {
                files : [{
                    str:        [ "My jinja2 content with var: {{ username }}" ],
                    str_append: "My ENDING jinja2 content with var: {{ username }}",
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-string_content.html'
                }]
            },
            string_file_content: {
                files : [{
                    src:        'test/views/template.j2',
                    str:        [ "My jinja2 content with var: {{ username }}" ],
                    str_append: "My ENDING jinja2 content with var: {{ username }}",
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-string_file_content.html'
                }]
            },
            string_file_content_prepend: {
                files : [{
                    src:        'test/views/template.j2',
                    str:        [ "My jinja2 content with var: {{ username }}" ],
                    str_prepend: "My BEGINING jinja2 content with var: {{ username }}",
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-string_file_content_prepend.html'
                }]
            },
            string_file_content_append: {
                options: { strAdd: 'append' },
                files : [{
                    src:        'test/views/template.j2',
                    str:        [ "My jinja2 content with var: {{ username }}" ],
                    str_append: "My ENDING jinja2 content with var: {{ username }}",
                    data:       [ 'test/fixtures/test-data.json', 'test/fixtures/test-data.yml' ],
                    dest:       'tmp/template-string_file_content_append.html'
                }]
            },
            modify_env: {
                options: {
                    modifyEnv: function (env) {
                        env.addFilter('testModifyEnv', function (string) {
                            // Whatever the string is we simply return sausages
                            return "Sausages";
                        });
                        return env;
                    }
                },
                files : [{
                    str:        [ '{{ "Beans" | testModifyEnv }}' ],
                    dest:       'tmp/template-modify_env.html'
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
    grunt.registerTask('render', 'render one or more targets ("render[:target_name]")', function(){
        var targets = (arguments.length>0 ? arguments[0] : 'all');
        if (targets==='all') {
            grunt.task.run('nunjucks_render');
        } else {
            targets = targets.split(/,/g);
            for (var t in targets) {
                grunt.task.run('nunjucks_render:' + targets[t]);
            }
        }
    });

    // whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result
    grunt.registerTask('test', ['clean', 'nunjucks_render', 'nodeunit']);

    // by default, lint and run all tests
    grunt.registerTask('default', ['jshint', 'test']);

};
