
exports.up = function(knex, Promise) {
	return knex.schema.createTableIfNotExists('blacklist', (table) => {
		table.increments('id');
		table.string('token').index();
		table.timestamp('expirationDate').index();
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('blacklist');
};
