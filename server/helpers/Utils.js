/* globals module, require, console */
'use strict';

const fs = require('fs');

/**
 * @namespace Utils
 */
const Utils = {
	/**
	 * Require all files in a directory
	 * 
	 * @param  {Object}		module	The context that require new modules
	 * @param  {string}		path	Path to directory
	 * @param  {function}	filter	Callback that filters which files to require
	 */
	requireFilesInDirectory: (context, path, filter) => {
		if (typeof path !== 'string') {
			throw 'Must provide path';
		}

		if (typeof filter !== 'function') {
			filter = (files) => {
				files.forEach((file) => {
					if (file.search(/^.*\.js$/) >= 0) {
						require(path + '/' + file)(context);
					}
				});
			};
		}

		var files = fs.readdirSync(path);

		filter(files);
	}
};

module.exports = Utils;