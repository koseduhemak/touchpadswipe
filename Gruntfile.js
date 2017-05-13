/**
 * Created by mfuesslin on 28.11.2016.
 */
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['options/*.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        uglify: {
            build: {
                files: [
                    {
                        src: ['src/*.js'],
                        dest: 'dist/<%= pkg.name %>.min.js'
                    },
                    {
                        src: ['src/options/*.js'],
                        dest: 'dist/options/options.min.js'
                    }
                ]
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: ['**/*.scss'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: { // Begin CSS Minify Plugin
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist',
                    ext: '.min.css'
                }]
            }
        },
        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.<%= pkg.version %>.zip'
                },
                files: [
                    {expand: true, cwd: "dist/", src: ['*'], dest: '/'}
                ]
            }
        },

        watch: { // Compile everything into one task with Watch Plugin
            css: {
                files: 'src/sass/*.scss',
                tasks: ['sass', 'cssmin']
            },
            js: {
                files: 'src/*.js',
                tasks: ['uglify']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    /*grunt.loadNpmTasks('grunt-contrib-uglify');

     grunt.loadNpmTasks('grunt-sass');

     grunt.loadNpmTasks('grunt-contrib-cssmin');

     grunt.loadNpmTasks('grunt-update_json');

     grunt.loadNpmTasks('grunt-contrib-watch');*/

    // Default task(s).
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('updatejson', function (key, value) {
        var pkg = grunt.file.readJSON('package.json');
        var projectFile = "src/manifest.json";


        if (!grunt.file.exists(projectFile)) {
            grunt.log.error("file " + projectFile + " not found");
            return true;//return false to abort the execution
        }
        var manifest = grunt.file.readJSON(projectFile);//get file as json object
        manifest.version = pkg.version;
        manifest.description = pkg.description;
        manifest.name = pkg.name;
        manifest["content_scripts"][0]["css"] = ["anim.min.css"];
        manifest["content_scripts"][0]["js"] = [pkg.name + ".min.js"];

        grunt.file.write("dist/manifest.json", JSON.stringify(manifest, null, 2));//serialize it back to file

    });

    grunt.registerTask('dist', ['copy', 'sass', 'cssmin', 'uglify', 'updatejson', 'compress']);

};