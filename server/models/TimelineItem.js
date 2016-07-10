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
		id: {type: 'number'},
		timelineId: {type: 'number'},
		// is text the correct type?
		// From what I can see it'll still be string?
		// https://spacetelescope.github.io/understanding-json-schema/reference/type.html
		// you mean the two id columns right? if they're id's then won't they be numbers rather than strings?
		content: {type: 'string'}
	}
};

module.exports = TimelineItem;