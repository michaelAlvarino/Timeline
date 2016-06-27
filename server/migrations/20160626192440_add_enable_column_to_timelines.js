
exports.up = function(knex, Promise) {
	return knex.schema.table('timelines', (table) => {
		// defaults to true, but inputs 't' into the column, which is a valid true value in postgresql
		table.boolean('enable').defaultTo(true);
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.table('timelines', (table) => {
		table.dropColumn('enable');
	})
  
};
