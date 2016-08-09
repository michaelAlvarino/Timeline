'use strict';
/* globals require, module */

const User = require('./../models/User.js');
const Blacklist = require('./../models/Blacklist.js');
const AuthHelper = require('../helpers/AuthHelper.js');
const Utils = require('../helpers/Utils.js');

module.exports = function(app, redis, redisClient) {
	app.post('/api/login', (req, res) => {
		var email		= req.body.email,
			password	= req.body.password;

		User.findByCredentials(email, password)
			.then((token) => {
				var defaultExpirationTimeInDays = 10
				, expiryDate = new Date().setUTCDate(expiryDate.getUTCDate() + defaultExpirationTimeInDays)
				, verify = AuthHelper.authenticateUser(token.token);

				Blacklist.query()
				.where('token', '=', token)
				//.insertAndFetch({token: token,
				//	expirationDate: expiryDate.toISOString()})
				.then((data) => {
					// if the query returns nothing (they're not blacklisted)
					// and we can authenticate their token... respond successfully
					if(Utils.objectIsEmpty(data) && verify){
						return res.json({
							success: true,
							data: token,
							errors: []
						});
					} else if(verify){
						// they were verified, but blacklisted with current token
						// either they were blacklisted or we failed to authenticate their user						
						return res.json({
							success: true,
							errors: ['log in failed']
						});
					}
				})
				.catch((errors) => {
					return res.json({
						success: false, 
						data: null,
						errors: [errors]})
				})
			})
			.catch((errors) => {
				return res.status(403).json({
					success: false, 
					data: null,
					errors: [errors]
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
		if(token && AuthHelper.authenticateUser(token) && !(AuthHelper.isAdmin(token))){
			Blacklist.insertAndFetch(token) // maybe just insert here?
			.then((data) => {
				return res.json({
					success: true,
					data: 'successfully logged out',
					errors: []
				});
			})
			.catch((errors) => {
				return res.status(403).json({
					success: false, 
					data: null,
					errors: [errors]
				});
			});
		}
	});
};
