'use strict';

const Model = require('objection').Model;

class Blacklist extends Model {
	static get tableName () { 
		return 'blacklist'; 
	}

	static get jsonSchema(){
		return {
			type: 'object',
			properties: {
				id: {type: 'integer'},
				token: {type: 'string', minLength: 1, maxLength: 255},
				expirationDate: {type: 'string', format: 'date-time'}
			}
		};
	}
}

module.exports = Blacklist;
