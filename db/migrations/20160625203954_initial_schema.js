
exports.up = function(knex, Promise) {
	return knex.schema
		.createTableIfNotExists('users', (table) => {
			table.increments().primary();
			table.string('email', 255);
			table.string('passwordDigest', 255);
			table.string('userType', 64);
			table.timestamp('createdDate');
			table.timestamp('updatedDate');
		})
		.createTableIfNotExists('timelines',(table) => {
			table.increments().primary();
			table.string('name', 255);
			table.timestamp('createdDate');
			table.timestamp('updatedDate');
		})
		.createTableIfNotExists('timelineItems', (table) => {
			table.increments().primary();
			table.integer('timelineId').unsigned().references('id').inTable('timelines');
			table.text('content');
			table.string('title', 255);
			table.string('imageUrl', 255);
			table.integer('userId');
			table.string('status', 32);
			table.timestamp('createdDate');
			table.timestamp('updatedDate');
		})
		.createTableIfNotExists('timelineItemLogs', (table) => {
			table.increments().primary();
			table.integer('timelineItemId').unsigned().references('id').inTable('timelineItems');
			table.text('oldContent');
			table.text('newContent');
			table.string('oldTitle', 255);
			table.string('newTitle', 255);
			table.string('oldStatus', 255);
			table.string('newStatus', 255);
			table.timestamp('createdDate');
		})
		.createTableIfNotExists('trackingActions', (table) => {
			table.increments().primary();
			table.integer('userId');
			table.string('resourceType', 255);
			table.integer('resourceId');
			table.timestamp('createdDate');
		})
		.createTableIfNotExists('tags', (table) => {
			table.increments().primary();
			table.string('name', 255);
		})
		.createTableIfNotExists('tagItems', (table) => {
			table.increments().primary();
			table.integer('tagId');
			table.integer('timelineItemId');
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTableIfExists('timelineItemLogs')
		.dropTableIfExists('trackingActions')
		.dropTableIfExists('tags')
		.dropTableIfExists('tagItems')
		.dropTableIfExists('timelineItems')
		.dropTableIfExists('timelines')
		.dropTableIfExists('users');
};
