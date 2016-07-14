/* globals module, require */
'use strict';

const jwt		= require('jsonwebtoken');
const config	= require('../../config');
const Blacklist = require('../models/Blacklist');

const defaultExpirationTimeInDays = 10;
const defaultExpirationTimeInWords = defaultExpirationTimeInDays + ' days';

/**
 * @module AuthHelper
 */
const AuthHelper = {
	/**
	 * Checks that a user has a signed JSON Web Token that is not in the TokenBlacklist
	 * 
	 * @param	{strring}	token	JSON Web Token
	 * @return	{Promise}
	 */
	verifyToken: (token) => {
		if (typeof token !== 'string') {
			throw 'Token must be a string';
		}

		// TODO: Update this to use Redis instead of the DB
		// redisClient.get(token)
		// 	.then((data) => {
		// 		if (data)
		// 			return true;
		// 		else
		// 			return false;
		// 	})
		// 	.catch((err) => {
		// 		return 'Error connecting to Redis server';
		// 	})
		return Blacklist.query()
			.where('token', token)
			.then((token) => {
				return new Promise((fulfill, reject) => {
					if (token.length > 0) {	
						reject(false);
					} else {
						fulfill(true);
					}	
				})
			})
			.catch((err) => {
				return new Promise((fulfill, reject) => {
					reject(err);
				});
			})
	},

	/**
	 * Check that the user has a signed JSON Web Token
	 * 
	 * @param	{string}	token	JSON Web Token
	 * @return	{boolean}			True if the user has a valid JSON Web Token
	 */
	authenticateUser: (token) => {
		// without !! this was returning the jwt.verify object rather than a true boolean
		return !!(token && jwt.verify(token, config.tokenSecretKey));
	},

	/**
	 * Check that the user has a signed JSON token with the same ID
	 * 
	 * @param	{string}	id		ID of the user to alter
	 * @param	{string}	token	String representing a hashed JSON Web Token
	 */
	authenticateUserWithId: (id, token) => {
		if (!AuthHelper.authenticateUser(token)) {
			return false;
		}
		
		var user = jwt.decode(token, { complete: true }).payload;

		return id == user.id;
	},

	/**
	 * Returns true if the user is an admin
	 * 
	 * @param	{string}	token	A hashed JWT
	 * @return	{boolean}
	 */
	isAdmin: (token) => {
		var user = jwt.decode(token, { complete: true }).payload;

		return user.userType === 'admin';
	},

	/**
	* Returns user id
	*
	* @param {string} token A hashed JWT
	* @return {numeric} user id
	*/
	getUserId: (token) => {
		if(!AuthHelper.authenticateUser(token))
			return -1;
		return jwt.decode(token, config.tokenSecretKey).payload.id;
	},

	/**
	 * Returns the default expiration time in days (10 days)
	 * 
	 * @return {int}
	 */
	getDefaultExpirationTimeInDays: () => {
		return defaultExpirationTimeInDays;
	},

	/**
	 * Returns a Date object a specified number of days in the future
	 * 
	 * @param  {int}		days	Number of days to go in the future (defaults to defaultExpirationTimeInDays)
	 * @return {Date}      	date	A Date object 
	 * @throws {Exception}			If days is not a positive number
	 */
	getFutureDate: (days) => {
		if (typeof days !== 'number') {
			days = defaultExpirationTimeInDays;
		}

		if (days < 0) {
			throw 'Days must be a positive number';
		}

		var date = new Date();
		date.setUTCDate(date.getUTCDate() + defaultExpirationTimeInDays);

		return date;
	},

	/**
	 * Returns a signed JWT for a given payload
	 * @param	{Object}		payload			Payload to encrypt
	 * @param	{string} 		daysToExpire	Date for JWT to expire
	 * @return	{JSONWebToken}
	 */
	generateJWT: (payload, daysToExpire) => {
		if (typeof payload === 'undefined') {
			throw 'Payload cannot be undefined';
		}

		if (typeof daysToExpire === 'undefined') {
			daysToExpire = defaultExpirationTimeInWords;
		}

		return jwt.sign(
			payload, 
			config.tokenSecretKey,
			{ expiresIn: daysToExpire }
		);
	},

	invalidateToken: (token) => {
		var decoded = jwt.decode(token, config.tokenSecretKey);
		var	expirationDate = new Date(decoded.exp);

		return {
			token: token,
			expirationDate: expirationDate.toISOString()
		};
	}
};

module.exports = AuthHelper;