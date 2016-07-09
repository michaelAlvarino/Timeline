// Update with your config settings.

const config = require('./config.json');

module.exports = {
	test: {
		client: 'postgres',
		connection: {
			database: 'timeline_test',
			user: config.dbUsername,
			password: config.dbPassword
		},
		seeds: {
			directory: __dirname + '/server/seeds/test'
		},
		migrations: {
			directory: __dirname + '/server/migrations'
		}
	},
	development: {
		client: 'postgres',
		connection: {
			database: 'timeline',
			user: config.dbUsername,
			password: config.dbPassword
		},
		migrations: {
			directory: __dirname + '/server/migrations'
		}
	}
};
