'use strict';
/* globals require, module */

const User = require('./../models/User.js');
const Blacklist = require('./../models/Blacklist.js');
const AuthHelper = require('../helpers/AuthHelper.js');

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
				.insertAndFetch({token: token,
					expirationDate: expiryDate.toISOString()})
				.then((data) => {
					res.json({
						success: true,
						token: token
					});
				})
				.catch((errors) => {
					res.json({success: false, message: errors})
				})

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
		var now = new Date().toISOString()
		, token = req.body.token;
		// need to make sure we're logging out the right user, who is currently logged in
		if(AuthHelper.authenticateUser(token) && !(AuthHelper.isAdmin(token))){
			Blacklist.delete()
			.where('token', '=', token)
			.then((numberOfRowsDeleted) => {
				res.json({
					success: true,
					message: 'successfully logged out'
				});
			})
			.catch((errors) => {
				res.status(403).json({success: false, message: errors});
			})
		}
		// maybe add an else where we handle the case of an admin logging out another user
	});
};