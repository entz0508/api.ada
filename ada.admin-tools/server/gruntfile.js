module.exports = function (grunt) {
	"use strict";

	grunt.config.init({
		ts: {
			app: {
				files: [{
					src: ["scripts/**/*.ts", "scripts/**/*.d.ts"],
					dest: "build"
				}],
				options: {
					module: "commonjs",
					noLib: false,
					target: "es6",
					forceConsistentCasingInFileNames: true,
					sourceMap: true,
					inlineSourceMap: true,
					rootDir: "scripts"
				}
			}
		},
		clean: {
			folder: ['build/**']
		},
		tslint: {
			options: {
				configuration: "tslint.json"
			},
			files: {
				src: ["scripts/**/*.ts"]
			}
		},
		watch: {
			ts: {
				files: ["js/scripts/**/*.ts", "scripts/**/*.ts"],
				tasks: ["ts", "tslint"]
			}
		},
		concat_sourcemap: {
			options: {},
			target: {
				files: {
					'dest/default_options.js': ['scripts/a.js', 'scripts/b.js']
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-tslint");
	grunt.loadNpmTasks('grunt-concat-sourcemap');
	grunt.loadNpmTasks("grunt-contrib-clean");

	grunt.registerTask("default", [
		"clean",
		"ts",
		"tslint"
	]);
};