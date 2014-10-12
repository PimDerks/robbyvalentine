module.exports = function(grunt) {

    // set the grunt force option (in wait of csslint task force option)
    grunt.option('force',true);

    // setup
    grunt.initConfig({

        pkg:grunt.file.readJSON('package.json'),

        /**
         * Set Environment variables
         */
        env:{
            src:'./src',
            dest:'./dest',
            site:'./www',
            temp:'./tmp',
            static:'<%= env.src %>/_static',
            banner:'/* <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
                ' */'
        },

        /**
         * Generate CSS files
         */
        sass:{
            dev:{
                options:{
                    style:'nested'
                },
                files:{
                    '<%= env.temp %>/css/styles.merged.css':'<%= env.static %>/scss/styles.scss'
                }
            }
        },
        csslint:{
            dev:{
                options:{
                    // https://github.com/stubbornella/csslint/wiki/Rules
                    // not all rules have been set to true since that would be too strict and not match project (as in we're not going to support IE6 so adjoining classes is irrelevant)
                    csslintrc:'.csslintrc',
                    force:true
                },
                src:['<%= env.temp %>/css/*.merged.css']
            }
        },
        autoprefixer:{
            modern:{
                options:{
                    browsers:['last 2 versions', 'ie 9']
                },
                src:'<%= env.temp %>/css/styles.merged.css',
                dest:'<%= env.temp %>/css/styles.prefixed.css'
            }
        },
        cssmin:{
            dev:{
                files:{
                    '<%= env.temp %>/css/styles.min.css':'<%= autoprefixer.modern.dest %>'
                }
            }
        },

        /**
         * Copy static
         */
        copy:{
            static:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.temp %>',
                        src:'**',
                        dest:'<%= env.site %>/_static/'
                    }
                ]
            },
            media:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.src %>/_media/',
                        src:'**',
                        dest:'<%= env.site %>/_media/'
                    }
                ]
            }
        },

        /**
         * Generate static site using Jekyll
         */
        jekyll:{
            all:{
                options:{
                    src:'<%= env.src %>',
                    config:'./_config.yml',
                    dest:'<%= env.site %>'
                }
            }
        },

        /**
         * Setup Webserver
         */
        connect:{
            server:{
                options:{
                    hostname:'*',
                    port:4000,
                    keepalive:true,
                    base:'<%= env.site %>'
                }
            }
        },

        /**
         * Watch static files
         */
        watch:{
            sass:{
                files:['<%= env.static %>/**/*.scss'],
                tasks:['_css','copy:static']
            },

            jekyll:{
                files:['<%= env.src %>/**/*.html','<%= env.src %>/**/*.markdown'],
                tasks:['_html']
            }
        },

        /**
         * Allows running of various concurrent tasks at once
         */
        concurrent:{
            all:{
                options:{
                    logConcurrentOutput: true,
                    limit:20
                },
                tasks:[

                    // start REST server and HTTP server
                    'connect:server',

                    // watch static files
                    'watch:sass',

                    // watch HTML files
                    'watch:jekyll',

                    // start first build
                    'build'
                ]
            }
        }

    });


    /**
     * Needs the following node modules
     */
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-jekyll');

    // 'private' css build set
    // grunt.registerTask('_css',['sass','csslint','autoprefixer','cssmin']);
    grunt.registerTask('_css',['sass','autoprefixer']);

    // 'private' html build set
    grunt.registerTask('_html',['jekyll','copy:static','copy:media']);

    /**
     * Quick build of the project
     */
    grunt.registerTask('build',['_css','_html']);

    /**
     * Sets up dev environment
     */
    grunt.registerTask('dev',['concurrent']);

};