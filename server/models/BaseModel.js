'use strict';
/* globals module */
const pg 				= require('pg');
const config 			= require('../../config.json');
const connectionString 	= "postgres://" + config.dbUsername + ":" + config.dbPassword + "@localhost/timeline";

class BaseModel {
	constructor () {
		this.errors = [];
		this.pg = pg;
		this.connectionString = connectionString;
	}

	getValidations () {
		return {};
	}

	isValid () {
		var valid = true, validations = this.getValidations(), key;
		for (key in validations) {
			if (validations.hasOwnProperty(key) && eval(validations[key])) {
				this.errors.push(key);
				valid = false;
			}
		}

		return valid;
	}
}

module.exports = BaseModel;