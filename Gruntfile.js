/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var fs = require("fs-extra");
var sass = require("sass");

module.exports = function(grunt) {

    var nodemonArgs = ["-V"];
    var flowFile = grunt.option('flowFile');
    if (flowFile) {
        nodemonArgs.push(flowFile);
        process.env.NODE_RED_ENABLE_PROJECTS=false;
    }
    var userDir = grunt.option('userDir');
    if (userDir) {
        nodemonArgs.push("-u");
        nodemonArgs.push(userDir);
    }

    var browserstack = grunt.option('browserstack');
    if (browserstack) {
        process.env.BROWSERSTACK = true;
    }
    var nonHeadless = grunt.option('non-headless');
    if (nonHeadless) {
        process.env.NODE_RED_NON_HEADLESS = true;
    }
    const pkg = grunt.file.readJSON('package.json');
    process.env.NODE_RED_PACKAGE_VERSION = pkg.version;
    grunt.initConfig({
        pkg: pkg,
        paths: {
            dist: ".dist"
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: { src: ["test/unit/_spec.js","test/unit/**/*_spec.js","test/nodes/**/*_spec.js"] },
            core: { src: ["test/unit/_spec.js","test/unit/**/*_spec.js"]},
            nodes: { src: ["test/nodes/**/*_spec.js"]}
        },
        webdriver: {
            all: {
                configFile: 'test/editor/wdio.conf.js'
            }
        },
        nyc: {
            options: {
                cwd: '.',
                include: ['packages/**'],
                excludeNodeModules: false,
                exclude: ['packages/editor-client/**'],
                reporter: ['lcov', 'html','text-summary'],
                reportDir: 'coverage',
                all: true
            },
            all:   { cmd: false, args: ['grunt', 'simplemocha:all'] },
            core:  { options: { exclude:['packages/editor-client/**', 'packages/nodes/**']},cmd: false, args: ['grunt', 'simplemocha:core'] },
            nodes: { cmd: false, args: ['grunt', 'simplemocha:nodes'] }
        },
        jshint: {
            options: {
                jshintrc:true
                // http://www.jshint.com/docs/options/
                //"asi": true,      // allow missing semicolons
                //"curly": true,    // require braces
                //"eqnull": true,   // ignore ==null
                //"forin": true,    // require property filtering in "for in" loops
                //"immed": true,    // require immediate functions to be wrapped in ( )
                //"nonbsp": true,   // warn on unexpected whitespace breaking chars
                ////"strict": true, // commented out for now as it causes 100s of warnings, but want to get there eventually
                //"loopfunc": true, // allow functions to be defined in loops
                //"sub": true       // don't warn that foo['bar'] should be written as foo.bar
            },
            // all: [
            //     'Gruntfile.js',
            //     'red.js',
            //     'packages/**/*.js'
            // ],
            // core: {
            //     files: {
            //         src: [
            //             'Gruntfile.js',
            //             'red.js',
            //             'packages/**/*.js',
            //         ]
            //     }
            // },
            nodes: {
                files: {
                    src: [ 'packages/nodes/core/*/*.js' ]
                }
            },
            editor: {
                files: {
                    src: [ 'packages/editor-client/src/js/**/*.js' ]
                }
            },
            tests: {
                files: {
                    src: ['test/**/*.js']
                },
                options: {
                    "expr": true
                }
            }
        },
        concat: {
            options: {
                separator: ";",
            },
            build: {
                src: [
                    // Ensure editor source files are concatenated in
                    // the right order
                    "packages/editor-client/src/js/jquery-addons.js",
                    "packages/editor-client/src/js/red.js",
                    "packages/editor-client/src/js/events.js",
                    "packages/editor-client/src/js/hooks.js",
                    "packages/editor-client/src/js/i18n.js",
                    "packages/editor-client/src/js/settings.js",
                    "packages/editor-client/src/js/user.js",
                    "packages/editor-client/src/js/comms.js",
                    "packages/editor-client/src/js/runtime.js",
                    "packages/editor-client/src/js/multiplayer.js",
                    "packages/editor-client/src/js/text/bidi.js",
                    "packages/editor-client/src/js/text/format.js",
                    "packages/editor-client/src/js/ui/state.js",
                    "packages/editor-client/src/js/plugins.js",
                    "packages/editor-client/src/js/nodes.js",
                    "packages/editor-client/src/js/font-awesome.js",
                    "packages/editor-client/src/js/history.js",
                    "packages/editor-client/src/js/validators.js",
                    "packages/editor-client/src/js/ui/utils.js",
                    "packages/editor-client/src/js/ui/common/editableList.js",
                    "packages/editor-client/src/js/ui/common/treeList.js",
                    "packages/editor-client/src/js/ui/common/checkboxSet.js",
                    "packages/editor-client/src/js/ui/common/menu.js",
                    "packages/editor-client/src/js/ui/common/panels.js",
                    "packages/editor-client/src/js/ui/common/popover.js",
                    "packages/editor-client/src/js/ui/common/searchBox.js",
                    "packages/editor-client/src/js/ui/common/tabs.js",
                    "packages/editor-client/src/js/ui/common/stack.js",
                    "packages/editor-client/src/js/ui/common/typedInput.js",
                    "packages/editor-client/src/js/ui/common/toggleButton.js",
                    "packages/editor-client/src/js/ui/common/autoComplete.js",
                    "packages/editor-client/src/js/ui/actions.js",
                    "packages/editor-client/src/js/ui/deploy.js",
                    "packages/editor-client/src/js/ui/diagnostics.js",
                    "packages/editor-client/src/js/ui/diff.js",
                    "packages/editor-client/src/js/ui/keyboard.js",
                    "packages/editor-client/src/js/ui/env-var.js",
                    "packages/editor-client/src/js/ui/workspaces.js",
                    "packages/editor-client/src/js/ui/statusBar.js",
                    "packages/editor-client/src/js/ui/view.js",
                    "packages/editor-client/src/js/ui/view-annotations.js",
                    "packages/editor-client/src/js/ui/view-navigator.js",
                    "packages/editor-client/src/js/ui/view-tools.js",
                    "packages/editor-client/src/js/ui/sidebar.js",
                    "packages/editor-client/src/js/ui/palette.js",
                    "packages/editor-client/src/js/ui/tab-info.js",
                    "packages/editor-client/src/js/ui/tab-info-outliner.js",
                    "packages/editor-client/src/js/ui/tab-help.js",
                    "packages/editor-client/src/js/ui/tab-config.js",
                    "packages/editor-client/src/js/ui/tab-context.js",
                    "packages/editor-client/src/js/ui/palette-editor.js",
                    "packages/editor-client/src/js/ui/editor.js",
                    "packages/editor-client/src/js/ui/editors/panes/*.js",
                    "packages/editor-client/src/js/ui/editors/*.js",
                    "packages/editor-client/src/js/ui/editors/code-editors/*.js",
                    "packages/editor-client/src/js/ui/event-log.js",
                    "packages/editor-client/src/js/ui/tray.js",
                    "packages/editor-client/src/js/ui/clipboard.js",
                    "packages/editor-client/src/js/ui/library.js",
                    "packages/editor-client/src/js/ui/notifications.js",
                    "packages/editor-client/src/js/ui/search.js",
                    "packages/editor-client/src/js/ui/contextMenu.js",
                    "packages/editor-client/src/js/ui/actionList.js",
                    "packages/editor-client/src/js/ui/typeSearch.js",
                    "packages/editor-client/src/js/ui/subflow.js",
                    "packages/editor-client/src/js/ui/group.js",
                    "packages/editor-client/src/js/ui/userSettings.js",
                    "packages/editor-client/src/js/ui/projects/projects.js",
                    "packages/editor-client/src/js/ui/projects/projectSettings.js",
                    "packages/editor-client/src/js/ui/projects/projectUserSettings.js",
                    "packages/editor-client/src/js/ui/projects/tab-versionControl.js",
                    "packages/editor-client/src/js/ui/touch/radialMenu.js",
                    "packages/editor-client/src/js/ui/tour/*.js"
                ],
                nonull: true,
                dest: "packages/editor-client/public/red/red.js"
            },
            vendor: {
                files: [
                    {
                        src: [
                            "packages/editor-client/src/vendor/jquery/js/jquery-3.7.1.min.js",
                            "packages/editor-client/src/vendor/jquery/js/jquery-migrate-3.5.2.min.js",
                            "packages/editor-client/src/vendor/jquery/js/jquery-ui-1.14.1.min.js",
                            "packages/editor-client/src/vendor/jquery/js/jquery.ui.touch-punch.min.js",
                            "node_modules/marked/marked.min.js",
                            "node_modules/dompurify/dist/purify.min.js",
                            "packages/editor-client/src/vendor/d3/d3.v3.min.js",
                            "node_modules/i18next/i18next.min.js",
                            "node_modules/i18next-http-backend/i18nextHttpBackend.min.js",
                            "node_modules/jquery-i18next/jquery-i18next.min.js",
                            "node_modules/jsonata/jsonata-es5.min.js",
                            "packages/editor-client/src/vendor/jsonata/formatter.js",
                            "packages/editor-client/src/vendor/ace/ace.js",
                            "packages/editor-client/src/vendor/ace/ext-language_tools.js"
                        ],
                        nonull: true,
                        dest: "packages/editor-client/public/vendor/vendor.js"
                    },
                    // {
                    //     src: [
                    //         // TODO: resolve relative resource paths in
                    //         //       bootstrap/FA/jquery
                    //     ],
                    //     dest: "packages/editor-client/public/vendor/vendor.css"
                    // },
                    {
                        src: [
                            "node_modules/jsonata/jsonata-es5.min.js",
                            "packages/editor-client/src/vendor/jsonata/worker-jsonata.js"
                        ],
                        nonull: true,
                        dest: "packages/editor-client/public/vendor/ace/worker-jsonata.js",
                    },
                    {
                        src: "node_modules/mermaid/dist/mermaid.min.js",
                        nonull: true,
                        dest: "packages/editor-client/public/vendor/mermaid/mermaid.min.js",
                    },
                ]
            }
        },
        uglify: {
            build: {
                files: {
                    'packages/editor-client/public/red/red.min.js': 'packages/editor-client/public/red/red.js',
                    'packages/editor-client/public/red/main.min.js': 'packages/editor-client/public/red/main.js',
                    'packages/editor-client/public/vendor/ace/mode-jsonata.js': 'packages/editor-client/src/vendor/jsonata/mode-jsonata.js',
                    'packages/editor-client/public/vendor/ace/snippets/jsonata.js': 'packages/editor-client/src/vendor/jsonata/snippets-jsonata.js'
                }
            }
        },
        sass: {
            build: {
                options: {
                    implementation: sass,
                    outputStyle: 'compressed'
                },
                files: [{
                    dest: 'packages/editor-client/public/red/style.min.css',
                    src: 'packages/editor-client/src/sass/style.scss'
                }]
            }
        },
        jsonlint: {
            messages: {
                src: [
                    'packages/nodes/locales/**/*.json',
                    'packages/editor-client/locales/**/*.json',
                    'packages/runtime/locales/**/*.json'
                ]
            },
            keymaps: {
                src: [
                    'packages/editor-client/src/js/keymap.json'
                ]
            }
        },
        attachCopyright: {
            js: {
                src: [
                    'packages/editor-client/public/red/red.min.js',
                    'packages/editor-client/public/red/main.min.js'
                ]
            },
            css: {
                src: [
                    'packages/editor-client/public/red/style.min.css'
                ]
            }
        },
        clean: {
            build: {
                src: [
                    "packages/editor-client/public/red",
                    "packages/editor-client/public/index.html",
                    "packages/editor-client/public/favicon.ico",
                    "packages/editor-client/public/icons",
                    "packages/editor-client/public/vendor",
                    "packages/editor-client/public/types/node",
                    "packages/editor-client/public/types/node-red",
                ]
            },
            release: {
                src: [
                    '<%= paths.dist %>'
                ]
            }
        },
        watch: {
            js: {
                files: [
                    'packages/editor-client/src/js/**/*.js'
                ],
                tasks: ['copy:build','concat',/*'uglify',*/ 'attachCopyright:js']
            },
            sass: {
                files: [
                    'packages/editor-client/src/sass/**/*.scss'
                ],
                tasks: ['sass','attachCopyright:css']
            },
            json: {
                files: [
                    'packages/nodes/locales/**/*.json',
                    'packages/editor-client/locales/**/*.json',
                    'packages/runtime/locales/**/*.json'
                ],
                tasks: ['jsonlint:messages']
            },
            keymaps: {
                files: [
                    'packages/editor-client/src/js/keymap.json'
                ],
                tasks: ['jsonlint:keymaps','copy:build']
            },
            tours: {
                files: [
                    'packages/editor-client/src/tours/**/*.js'
                ],
                tasks: ['copy:build']
            },
            misc: {
                files: [
                    'CHANGELOG.md'
                ],
                tasks: ['copy:build']
            }
        },

        nodemon: {
            /* uses .nodemonignore */
            dev: {
                script: 'packages/node-red/red.js',
                options: {
                    args: nodemonArgs,
                    ext: 'js,html,json',
                    watch: [
                        'packages',
                        '!packages/editor-client'
                    ]
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        copy: {
            build: {
                files:[
                    {
                        src: 'packages/editor-client/src/js/main.js',
                        dest: 'packages/editor-client/public/red/main.js'
                    },
                    {
                        src: 'packages/editor-client/src/js/keymap.json',
                        dest: 'packages/editor-client/public/red/keymap.json'
                    },
                    {
                        cwd: 'packages/editor-client/src/images',
                        src: '**',
                        expand: true,
                        dest: 'packages/editor-client/public/red/images/'
                    },
                    {
                        cwd: 'packages/editor-client/src/vendor',
                        src: [
                            'ace/**',
                            'jquery/css/base/**',
                            'font-awesome/**',
                            'monaco/dist/**',
                            'monaco/types/extraLibs.js',
                            'monaco/style.css',
                            'monaco/monaco-bootstrap.js'
                        ],
                        expand: true,
                        dest: 'packages/editor-client/public/vendor/'
                    },
                    {
                        cwd: 'packages/editor-client/src',
                        src: [
                            'types/node/**/*.ts',
                            'types/node-red/*.ts',
                        ],
                        expand: true,
                        dest: 'packages/editor-client/public/'
                    },
                    {
                        cwd: 'packages/editor-client/src/icons',
                        src: '**',
                        expand: true,
                        dest: 'packages/editor-client/public/icons/'
                    },
                    {
                        expand: true,
                        src: ['packages/editor-client/src/index.html','packages/editor-client/src/favicon.ico'],
                        dest: 'packages/editor-client/public/',
                        flatten: true
                    },
                    {
                        src: 'CHANGELOG.md',
                        dest: 'packages/editor-client/public/red/about'
                    },
                    {
                        src: 'CHANGELOG.md',
                        dest: 'packages/node-red/'
                    },
                    {
                        cwd: 'packages/editor-client/src/ace/bin/',
                        src: '**',
                        expand: true,
                        dest: 'packages/editor-client/public/vendor/ace/'
                    },
                    {
                        cwd: 'packages/editor-client/src/tours',
                        src: '**',
                        expand: true,
                        dest: 'packages/editor-client/public/red/tours/'
                    }
                ]
            }
        },
        chmod: {
            options: {
                mode: '755'
            },
            release: {
                src: [
                    "packages/nodes/core/hardware/nrgpio",
                    "packages/runtime/lib/storage/localfilesystem/projects/git/node-red-*sh"
                ]
            }
        },
        'npm-command': {
            options: {
                cmd: "pack",
                cwd: "<%= paths.dist %>/modules"
            },
            'node-red': { options: { args: [__dirname+'/packages/node-red'] } },
            '@node-red/editor-api': { options: { args: [__dirname+'/packages/editor-api'] } },
            '@node-red/editor-client': { options: { args: [__dirname+'/packages/editor-client'] } },
            '@node-red/nodes': { options: { args: [__dirname+'/packages/nodes'] } },
            '@node-red/registry': { options: { args: [__dirname+'/packages/registry'] } },
            '@node-red/runtime': { options: { args: [__dirname+'/packages/runtime'] } },
            '@node-red/util': { options: { args: [__dirname+'/packages/util'] } }


        },
        mkdir: {
            release: {
                options: {
                    create: ['<%= paths.dist %>/modules']
                },
            },
        },
        compress: {
            release: {
                options: {
                    archive: '<%= paths.dist %>/node-red-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: 'packages/',
                src: [
                    '**',
                    '!editor-client/src/**'
                ]
            }
        },
        jsdoc : {
            modules: {
                src: [
                    'API.md',
                    'packages/node-red/lib/red.js',
                    'packages/runtime/lib/index.js',
                    'packages/runtime/lib/api/*.js',
                    'packages/runtime/lib/events.js',
                    'packages/runtime/lib/hooks.js',
                    'packages/util/**/*.js',
                    'packages/editor-api/lib/index.js',
                    'packages/editor-api/lib/auth/index.js',
                    'packages/registry/lib/index.js'
                ],
                options: {
                    destination: 'docs',
                    configure: './jsdoc.json',
                    fred: "hi there"
                }
            },
            _editor: {
                src: [
                    'packages/editor-client/src/js'
                    ],
                options: {
                    destination: 'packages/editor-client/docs',
                    configure: './jsdoc.json'
                }
            }

        },
        jsdoc2md: {
            runtimeAPI: {
                options: {
                    separators: true
                },
                src: [
                    'packages/runtime/lib/index.js',
                    'packages/runtime/lib/api/*.js',
                    'packages/runtime/lib/events.js'
                ],
                dest: 'packages/runtime/docs/api.md'
            },
            nodeREDUtil: {
                options: {
                    separators: true
                },
                src: 'packages/util/**/*.js',
                dest: 'packages/util/docs/api.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-chmod');
    grunt.loadNpmTasks('grunt-jsonlint');
    if (fs.existsSync(path.join("node_modules", "grunt-webdriver"))) {
        grunt.loadNpmTasks('grunt-webdriver');
    }
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
    grunt.loadNpmTasks('grunt-npm-command');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-simple-nyc');

    grunt.registerMultiTask('nodemon', 'Runs a nodemon monitor of your node.js server.', function () {
        const nodemon = require('nodemon');
        this.async();
        const options = this.options();
        options.script = this.data.script;
        let callback;
        if (options.callback) {
            callback = options.callback;
            delete options.callback;
        } else {
            callback = function(nodemonApp) {
                nodemonApp.on('log', function (event) {
                    console.log(event.colour);
                });
            };
        }
        callback(nodemon(options));
    });

    grunt.registerMultiTask('attachCopyright', function() {
        var files = this.data.src;
        var copyright = "/**\n"+
            " * Copyright OpenJS Foundation and other contributors, https://openjsf.org/\n"+
            " *\n"+
            " * Licensed under the Apache License, Version 2.0 (the \"License\");\n"+
            " * you may not use this file except in compliance with the License.\n"+
            " * You may obtain a copy of the License at\n"+
            " *\n"+
            " * http://www.apache.org/licenses/LICENSE-2.0\n"+
            " *\n"+
            " * Unless required by applicable law or agreed to in writing, software\n"+
            " * distributed under the License is distributed on an \"AS IS\" BASIS,\n"+
            " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n"+
            " * See the License for the specific language governing permissions and\n"+
            " * limitations under the License.\n"+
            " **/\n";

        if (files) {
            for (var i=0; i<files.length; i++) {
                var file = files[i];
                if (!grunt.file.exists(file)) {
                    grunt.log.warn('File '+ file + ' not found');
                    return false;
                } else {
                    var content = grunt.file.read(file);
                    if (content.indexOf(copyright) == -1) {
                        content = copyright+content;
                        if (!grunt.file.write(file, content)) {
                            return false;
                        }
                        grunt.log.writeln("Attached copyright to "+file);
                    } else {
                        grunt.log.writeln("Copyright already on "+file);
                    }
                }
            }
        }
    });

    grunt.registerTask('verifyPackageDependencies', function() {
        var done = this.async();
        var verifyDependencies = require("./scripts/verify-package-dependencies.js");
        verifyDependencies().then(function(failures) {
            if (failures.length > 0) {
                failures.forEach(f => grunt.log.error(f));
                grunt.fail.fatal("Failed to verify package dependencies");
            }
            done();
        });
    });

    grunt.registerTask('verifyUiTestDependencies', function() {
        if (!fs.existsSync(path.join("node_modules", "grunt-webdriver"))) {
            grunt.fail.fatal('You need to install the UI test dependencies first.\nUse the script in "scripts/install-ui-test-dependencies.sh"');
            return false;
        }
    });
    grunt.registerTask('generatePublishScript',
        'Generates a script to publish build output to npm',
            function () {
                const done = this.async();
                const generatePublishScript = require("./scripts/generate-publish-script.js");
                generatePublishScript().then(function(output) {
                    grunt.log.writeln(output);

                    const filePath = path.join(grunt.config.get('paths.dist'),"modules","publish.sh");
                    grunt.file.write(filePath,output);

                    done();
                });
            });
    grunt.registerTask('setDevEnv',
        'Sets NODE_ENV=development so non-minified assets are used',
            function () {
                process.env.NODE_ENV = 'development';
            });

    grunt.registerTask('default',
        'Builds editor content then runs code style checks and unit tests on all components',
        ['build','verifyPackageDependencies','jshint:editor','nyc:all']);

    grunt.registerTask('no-coverage',
        'Builds editor content then runs code style checks and unit tests on all components without code coverage',
        ['build','verifyPackageDependencies','jshint:editor','simplemocha:all']);


    grunt.registerTask('test-core',
        'Runs code style check and unit tests on core runtime code',
        ['build','nyc:core']);

    grunt.registerTask('test-editor',
        'Runs code style check on editor code',
        ['jshint:editor']);

    if (!fs.existsSync(path.join("node_modules", "grunt-webdriver"))) {
        grunt.registerTask('test-ui',
            'Builds editor content then runs unit tests on editor ui',
            ['verifyUiTestDependencies']);
    } else {
        grunt.registerTask('test-ui',
            'Builds editor content then runs unit tests on editor ui',
            ['verifyUiTestDependencies','build','jshint:editor','webdriver:all']);
    }

    grunt.registerTask('test-nodes',
        'Runs unit tests on core nodes',
        ['build','nyc:nodes']);

    grunt.registerTask('build',
        'Builds editor content',
        ['clean:build','jsonlint','concat:build','concat:vendor','copy:build','uglify:build','sass:build','attachCopyright']);

    grunt.registerTask('build-dev',
        'Developer mode: build dev version',
        ['clean:build','concat:build','concat:vendor','copy:build','sass:build','setDevEnv']);

    grunt.registerTask('dev',
        'Developer mode: run node-red, watch for source changes and build/restart',
        ['build','setDevEnv','concurrent:dev']);

    grunt.registerTask('release',
        'Create distribution zip file',
        ['build','verifyPackageDependencies','clean:release','mkdir:release','chmod:release','compress:release','pack-modules','generatePublishScript']);

    grunt.registerTask('pack-modules',
        'Create module pack files for release',
        ['mkdir:release','npm-command']);


    grunt.registerTask('coverage',
        'Run Istanbul code test coverage task',
        ['build','nyc:all']);

    grunt.registerTask('docs',
        'Generates API documentation',
        ['jsdoc']);
};
