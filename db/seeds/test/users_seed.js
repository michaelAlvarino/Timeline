/* globals exports */
'use strict'

const bcrypt = require('bcrypt')

exports.seed = (knex, Promise) => {
	// Deletes ALL existing entries
	return knex('users').del()
		.then(() => {
			let salt = bcrypt.genSaltSync()

			return knex('users').insert({
				email: 'harry.potter@hogwarts.edu',
				passwordDigest: bcrypt.hashSync('password', salt),
				userType: 'admin',
				createdDate: (new Date(1991, 6, 31)).toISOString(),
				updatedDate: (new Date()).toISOString()
			})
		})
		.then(() => {
			let salt = bcrypt.genSaltSync()

			return knex('users').insert({
				email: 'draco.malfoy@hogwarts.edu',
				passwordDigest: bcrypt.hashSync('password', salt),
				userType: 'admin',
				createdDate: (new Date(1980, 4, 5)).toISOString(),
				updatedDate: (new Date()).toISOString()
			})
		})
}
