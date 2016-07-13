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
				return res.json({
					success: true,
					status: 200,
					data: token
				});
			})
			.catch((errors) => {
				return res.status(403).json({
					success: false, 
					message: errors
				});
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
	app.delete('/api/logout', (req, res) => {
		var token = req.headers.timelinetoken || req.body.timelinetoken,
			id = req.body.id; // TODO: Temporary fix to logout a specific user

		// need to make sure we're logging out the right user, who is currently logged in
		// OR maybe we don't care? Worst case is bad UX where the user has to re-login
		if(AuthHelper.authenticateUserWithId(id, token) || AuthHelper.isAdmin(token)){
			return Blacklist.query()
				.insertAndFetch(AuthHelper.invalidateToken(token))
				.then((data) => {
					return res.json({
						status: 200,
						success: true,
						data: {}
					});
				})
				.catch((errors) => {
					return res.status(400).json({ 
						success: false, 
						message: errors
					});
				})
		} else {
			res.status(403).json({
				status: 403,
				success: false,
				message: 'Invalid credentials'
			});
		}
	});
};