'use strict';
/* globals module */
const _pg 				= require('pg');
const _config 			= require('../../config.json');
const _connectionString = 'postgres://' + _config.dbUsername + ':' + _config.dbPassword + '@localhost/timeline';

class BaseModel {
	static getTable () {
		return '';
	}
// some change
	static find (id, callback) {
		_pg.connect(_connectionString, (err, client, done) => {
			if (err) {
				done();
				console.log(err);
				res.status(500).json({success: false, data: err});
			} else {
				var query = client.query(
					'SELECT * FROM users WHERE id = $1', 
					[ id ]
				);

				// On success
				query.on('row', (row) => {
					callback(row);
				});
			}
		});
	}

	static findBy (attributes, callback) {
		var results = [], model = this;

		_pg.connect(_connectionString, (err, client, done) => {
			if (err) {
				done();
				console.log(err);
				res.status(500).json({success: false, data: err});
			} else {

				var query = client.query(
					_getFindByQuery(model, attributes), 
					_getFindByValues(attributes)
				);

				query.on('row', (row) => {
					results.push(row);
				});

				query.on('end', () => {
					callback(results);
				});
			}
		});
	}

	constructor (attributes) {
		if (typeof attributes === 'undefined') attributes = {};

		this.errors = [];
		this.id 	= attributes.id || null;
	}

	getPostgres () {
		return _pg;
	}

	getConnectionString () {
		return _connectionString;
	}

	getValidations () {
		return {};
	}

	getTable () {
		return this.table;
	}

	save () {
		return true;
	}

	destroy (callback) {
		var model = this;
		if (model.id) {
			model.getPostgres().connect(model.getConnectionString(), (err, client, done) => {
				if (err){
					done();
					console.log(err);
				} else {
					var query = client.query(
						'DELETE FROM ' + model.getTable() + ' WHERE id = $1', 
						[ model.id ]
					);

					query.on('end', () => {
						callback();
					});
				}
			});

			return true;
		}

		return false;
	}

	update (callback) {
		return true;
	}

	create (callback) {
		return true;
	}

	save (callback) {
		return true;
	}

	isValid () {
		var valid = true, validations = this.getValidations(), key;
		for (key in validations) {
			if (validations.hasOwnProperty(key) && validations[key]) {
				this.errors.push(key);
				valid = false;
			}
		}

		return valid;
	}
}

// Private methods
var _getFindByQuery = (model, attributes) => {
	if (typeof attributes === 'undefined') attributes = {};
	var STATEMENT = 'SELECT * FROM ' + model.getTable() + ' WHERE ',
		keys = Object.keys(attributes),
		length = keys.length;
	
	keys.forEach ((key, index, array) => {
		STATEMENT += key + ' = $' + (index + 1);
		if (index !== length - 1) STATEMENT += ' AND ';
	})

	console.log(STATEMENT);

	return STATEMENT + ';';
}

var _getFindByValues = (attributes) => {
	if (typeof attributes === 'undefined') attributes = {};

	return Object.keys(attributes).map((key, index, array) => {
		return attributes[key];
	});
}

module.exports = BaseModel;
