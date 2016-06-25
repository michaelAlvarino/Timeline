const config = require('../config.json');

module.exports = {

  production: {
    client: 'pg',
    connection: {
      database: 'timeline',
      user: config.dbUsername,
      password: config.dbPassword
    }
  }

};