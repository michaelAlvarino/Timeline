'use strict';
/* globals require, module */

const User = require('./../models/User.js');

module.exports = function(app) {
	app.post('/api/login', (req, res) => {
		var email		= req.body.email,
			password	= req.body.password;

		User.findByCredentials(email, password)
			.then((token) => {
				res.json(token);
			})
			.catch((errors) => {
				res.status(403).json(errors);
			});
	});
};