module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            before: {
                src: ["build", "temp_app"]
            },
            plugins: {
                src: ["build/www/libs/cordova_plugins.js", "build/www/libs/plugins"]
            },
            unused: {
                src: []
            },
            after: {
                src: ["**", "!build/**", "!node/**", "!node_modules/**"]
            }
        },

        copy: {
            tmpApp: {
                expand: true,
                src: ["**", "!node_modules/**",

                "!libs/jasmine/**", "!**/*.map", "!libs/**/*.md", "!libs/**/index.js", "!libs/**/package.json", "!libs/**/bower.json", "!libs/**/examples/**", "!libs/angular/angular.js", "!libs/angular-touch/angular-touch.js", "!libs/angular-route/angular-route.js", "!libs/angular-animate/angular-animate.js", "!libs/angular-bootstrap/ui-bootstrap-tpls.js", "!libs/lodash/dist/lodash.js", "!libs/lodash/dist/lodash.compat.js", "!libs/lodash/dist/lodash.compat.min.js", "!libs/lodash/dist/lodash.underscore.js", "!libs/lodash/dist/lodash.underscore.min.js", "!libs/angular-google-maps/angular-google-maps.js", "!libs/x2js/xml2json.min.js", "!libs/angular-bootstrap/ui-bootstrap.min.js", "!libs/angular-bootstrap/ui-bootstrap.js", "!libs/angular/angular.min.js.gzip",

                "!test/**", "!node/**", "!tests.html", "!Gruntfile.js", "!package.json"],
                dest: "temp_app/www"
            },
            restoreAngular: {
                expand: false,
                src: ["temp_app/www/libs/angular/angular.min.js", ],
                dest: "build/www/libs/angular/angular.min.js"
            },
            copyPlugins: {
                expand: true,
                cwd: "build/www/libs/",
                src: ["cordova_plugins.js", "plugins/**"],
                dest: "build/www/"
            }
        },

        replace: {
            buildindex: {
                src: 'build/www/index.html',
                overwrite: true,
                replacements: [{
                    from: 'data-main="app/bootstrap"',
                    to: 'data-main="app/app"'
                }]
            }
        },

        requirejs: {
            compile: {
                options: {
                    appDir: "temp_app/www",
                    mainConfigFile: "temp_app/www/app/bootstrap.js",
                    baseUrl: "app",
                    dir: "build/www",
                    removeCombined: true,
                    modules: [{
                        name: "app"
                    }],
                    optimize: "uglify2",
                    onBuildRead: function(moduleName, path, contents) {
                        if (path.indexOf('cordova.js') === -1) {
                            return contents;
                        } else {
                            return contents.replace(/define\s*\(/g, 'CORDOVADEFINE(');
                        }
                    },
                    onBuildWrite: function(moduleName, path, contents) {
                        if (path.indexOf('cordova.js') === -1) {
                            return contents;
                        } else {
                            return contents.replace(/CORDOVADEFINE\(/g, 'define(');
                        }
                    },
                    uglify2: {
                        compress: {
                            conditionals: false
                        },
                        warnings: true,
                        mangle: true
                    }
                }
            }
        },
        cssmin: {
            build: {
                expand: true,
                src: 'build/**/*.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', ['clean:before', 'copy:tmpApp', 'requirejs:compile', 'cssmin:build', 'copy:restoreAngular', 'copy:copyPlugins', 'clean:plugins', 'clean:unused', 'replace:buildindex', 'clean:after']);
};