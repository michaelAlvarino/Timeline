'use strict';
/* globals require, module */

const User = require('./../models/User.js')
const Blacklist = require('./../models/Blacklist.js')
const AuthHelper = require('../helpers/AuthHelper.js')
const Utils = require('../helpers/Utils.js')
const Response = require('../helpers/Response')

module.exports = function(app, redis, redisClient) {
	app.post('/api/login', (req, res) => {
		var email		= req.body.email,
			password	= req.body.password;

		User.findByCredentials(email, password)
			.then(user => {
				let token = AuthHelper.generateJWT(user)

				return res.json(Reponse.custom({
					status: 200,
					success: true,
					data: token
				}))
			})
			.catch(errors => {
				return res.status(403).json(Response.custom({
					status: 403,
					success: false, 
					data: null,
					errors: [ errors ]
			}))
		})
	})

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
		let token = req.headers.timelinetoken || req.body.timelinetoken
		let id = req.body.id

		// need to make sure we're logging out the right user, who is currently logged in
		if(token && AuthHelper.authenticateUser(token) && !(AuthHelper.isAdmin(token))){
			let expireInXDays = 10
			redisClient.set(token, 1)
			redisClient.expire(expireInXDays * 24 * 60 * 60)
		}
	})
}
