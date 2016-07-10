/* globals exports */
'use strict';

exports.seed = (knex, Promise) => {
	// Deletes ALL existing entries
	return knex('timelines').del()
		.then(() => {
			return knex('timelines').insert({
				name: 'Beauxbatons',
				enable: true,
				createdDate: (new Date(1991, 6, 31)).toISOString(),
				updatedDate: (new Date()).toISOString()
			});
		})
		.then(() => {
			return knex('timelines').insert({
				name: 'Durmstrang',
				enable: false,
				createdDate: (new Date(1980, 4, 5)).toISOString(),
				updatedDate: (new Date()).toISOString()
			});
		});
};
