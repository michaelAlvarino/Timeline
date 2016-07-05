'use strict';
/* globals require, module */

const User = require('./../models/User.js');
const Blacklist = require('./../models/Blacklist.js');

module.exports = function(app) {
	app.post('/api/login', (req, res) => {
		var email		= req.body.email,
			password	= req.body.password;

		User.findByCredentials(email, password)
			.then((token) => {
				var defaultExpirationTimeInDays = 10;
				// only split it into two lines for legibility.. though i'm honestly not sure how to make it
				// one "self referencing" line. also the defaultExpirationtime variable is only used here
				// and may be useless
				var expiryDate = new Date();
				expiryDate = expiryDate.setUTCDate(expiryDate.getUTCDate() + defaultExpirationTimeInDays)
				// add token to blacklist table
				Blacklist.query()
				.insert({token: token,
					expirationDate: expiryDate})

				// successfully logged in
				res.json({
					success: true,
					token: token
				});
			})
			.catch((errors) => {
				res.status(403).json({success: false, message: errors});
			});
	});

	/*
		A little tougher to invalidate tokens. Might need a new table where we blacklist specific tokens.
		Then, in User.findByCredentials or Utils.authenticateUser, we have to query to DB to see if the
		token is still valid. Will have to write a Cron or some script to periodically delete tokens that
		have expired. Otherwise, we might as well use session tokens.

		|------------------|
		|  tokenBlacklist  |
		|------------------|
		|       id         | <-- Primary Key
		|      token       | <-- Index this
		|  expirationDate  | <-- Index this too?
		|------------------|

	 */
	app.post('/api/logout', (req, res) => {
		res.status(500).json({ 
			success: false, 
			message: 'You are logged in forever :(' 
		});
	});
};