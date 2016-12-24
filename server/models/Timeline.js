'use strict';
/* globals require, module */

const Model = require('objection').Model;

class Timeline extends Model {
	static get tableName () { 
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
				createdDate: {type: 'string', format: 'date-time'},
				updatedDate: {type: 'string', format: 'date-time'}
			}
		};
	}

	static updateTimeline(timeline, timelineAttributes){
		
	}
}

Timeline.relationMappings = {
	timelineItems: {
		relation: Model.HasManyRelation,
		modelClass: __dirname + '/TimelineItem',
		join: {
			from: 'timelines.id',
			to: 'timelineItems.timelineId'
		}
	}
}


module.exports = Timeline;