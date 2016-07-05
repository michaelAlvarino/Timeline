'use strict';
// walt... am I creating the class correctly in es5 here? i so we cna keep it or change it to es6, idc i just wanted tot learn

const Model = require('objection').Model;

var TimelineItem = function(){

}

TimelineItem.prototype = Model.prototype;

TimlineItem.prototype.tableName() = function(){
	return 'timelineItems';
}

TimelineItem.prototype.jsonSchema(){
	return{
		type: 'object',
		required: ['timelineId', 'title', 'content', 'userId', 'createdDate', 'updatedDate'],
		properties:{
			id: {type: 'integer'},
			timelineId: {type: 'integer'},
			// is text the correct type?
			content: {type: 'text'}
		}
	}
}