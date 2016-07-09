/* globals module, require */
'use strict';

const jwt		= require('jsonwebtoken');
const config	= require('../../config');

/**
 * @module AuthHelper
 */
const AuthHelper = {
	/**
	 * Check that the user has a signed JSON Web Token
	 * 
	 * @param	{string}	token	JSON Web Token
	 * @return	{boolean}			True if the user has a valid JSON Web Token
	 */
	authenticateUser: (token) => {
		return token && jwt.verify(token, config.tokenSecretKey);
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
	}
};

module.exports = AuthHelper;