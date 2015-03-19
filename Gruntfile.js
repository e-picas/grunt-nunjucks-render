/**
 * grunt-nunjucks-render
 * https://github.com/piwi/grunt-nunjucks-render
 *
 * Copyright (c) 2015 Pierre Cassat
 * Licensed under the Apache 2.0 license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({

        nunjucks_render: {
            options: {
                directory:    'test/views/',
            },
            all: {
                files : [{
                    src:        'test/views/template.j2',
                    data:       [ 'test/test-data.json', 'test/test-data.yml' ],
                    dest:       'test/output/templates.html'
                }]
            }
        },

        watch: {
            nunjucks: {
                files: 'test/views/*',
                tasks: ['nunjucks_render']
            }
        }
    });

    grunt.registerTask('test', ['nunjucks_render']);
    grunt.registerTask('cleanup', 'clean up test files', function(){
        grunt.file.delete('test/output');
    });

};
