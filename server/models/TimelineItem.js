'use strict';

const Model = require('objection').Model;

/**
 * @class TimelineItem
 * @extends {Model}
 */
function TimelineItem() {
	Model.apply(this, arguments);
}

// instead of calling super.call we use the built-in Model.extend funciton provided by objection
Model.extend(TimelineItem);

TimelineItem.tableName = 'timelineItems';

TimelineItem.jsonSchema = {
	type: 'object',
	required: ['timelineId', 'title', 'content', 'userId', 'createdDate', 'updatedDate'],
	properties:{
		id: {type: 'integer'},
		timelineId: {type: 'integer'},
		// is text the correct type?
		// From what I can see it'll still be string?
		// https://spacetelescope.github.io/understanding-json-schema/reference/type.html
		// you mean the two id columns right? why would those be stored as strings?
		title: {type: 'string'},
		content: {type: 'string'},
		userId: {type: 'integer'},
		createdDate: {type: 'string', format: 'date-time'},
		updatedDate: {type: 'string', format: 'date-time'}
	}
};

module.exports = TimelineItem;