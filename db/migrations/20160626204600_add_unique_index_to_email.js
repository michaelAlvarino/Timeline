
exports.up = function(knex, Promise) {
	return knex.schema.table('users', (table) => {
		table.index('email').unique('email');
	});
};

exports.down = function(knex, Promise) {
    return knex.schema;
};
