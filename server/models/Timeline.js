'use strict';
/* globals require, module */

const Model = require('objection').Model;

class Timeline extends Model {
	static get tableName() { 
		return 'timelines'; 
	}

	static get jsonSchema(){
		return {
			type: 'object',
			required: ['name'],
			properties: {
				id: {type: 'integer'},
				name: {type: 'string', minLength: 1, maxLength: 255},
				enable: {type: 'boolean'},
				createdDate: {type: 'string'},
				updatedDate: {type: 'string'}
			}
		};
	}
}

module.exports = Timeline;