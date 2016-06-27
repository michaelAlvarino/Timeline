'use strict';

const model = require('objection').Model;

class Timeline extends model{

	static get tableName(){ return 'timelines' }

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