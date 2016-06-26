// Update with your config settings.

const config = require('../config.json');

module.exports = {
	development: {
		client: 'postgres',
		connection: {
			database: 'timeline',
			user: config.dbUsername,
			password: config.dbPassword
		}
	}
};
