'use strict';

const Model = require('objection').Model;

/**
 * @class TimelineItem
 * @extends {Model}
 */
var TimelineItem = function() {
	Model.apply(this, arguments);
	super.call(this);
}

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