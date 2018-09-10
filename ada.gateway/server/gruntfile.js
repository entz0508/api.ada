module.exports = function (grunt)
{
	"use strict";

	grunt.config.init({
		ts: {
			app: {
				files: [
					{
						src: ["scripts/**/*.ts"],
						dest: "build"
					}
				],
				options: {
					rootDir: "scripts",                     // where to locate .map.js files. [(default) '' == generated js location.]
					module: "commonjs",                     // default is none (''), but can be set to 'amd', 'commonjs', 'system', or other values.
					target: "es6",                          // 'es5' (default), 'es3', or 'es6' - targeted ECMAScript version
					noLib: false,                           // true, false (default) - do not automatically include lib.d.ts in compilation context
					forceConsistentCasingInFileNames: true, // true, false (default) - Disallow inconsistently-cased references to the same file.
					sourceMap: true,                        // true (default), false - indicates if source maps should be generated (.js.map)
					inlineSourceMap: true,                  // true, false (default) Emit a single file that includes source maps instead of emitting a separate .js.map file; If enabled, will automatically enable sourceMap.
					noImplicitAny: true,                    // true, false (default) - enable for stricter type checking
					// pretty: true,                           // true, false (default) - Stylize errors and messages using color and context.
				}
			}
		},
		clean: {
			folder: ['build/**']
		},
		tslint: {
			options: {
				configuration: "tslint.json",               // Object | string - A TSLint configuration; can either be a JSON configuration object or a path to a tslint.json config file.
				force: false,                               // If true, the task will suceed even if lint failures are found. Defaults to false.
				fix: false,                                 // If true, fixes linting errors for select rules. This may overwrite linted files. Defaults to false.
			},
			files: {
				src: ["scripts/**/*.ts"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-tslint");

	grunt.registerTask("default", [
		"clean",
		"ts",
		"tslint"
	]);
};