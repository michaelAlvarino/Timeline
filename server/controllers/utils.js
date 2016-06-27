'use strict';
/* globals module, require */

const jwt		= require('jsonwebtoken');
const config	= require('../../config');
const Utils 	= {
	/**
	 * Check that the user has a signed JSON Web Token
	 * 
	 * @param	{[string]}	token	JSON Web Token
	 * @return	{[boolean]}			True if the user has a valid JSON Web Token
	 */
	authenticateUser: (token) => {
		return token && jwt.verify(token, config.tokenSecretKey);
	},

	/**
	 * Check that the user has a signed JSON token with the same ID
	 * 
	 * @param	{[string]}		id		ID of the user to alter
	 * @param	{[string]}		token	String representing a hashed JSON Web Token
	 */
	authenticateUserWithId: (id, token) => {
		if (!Utils.authenticateUser(token)) {
			return false;
		}
		
		var user = jwt.decode(token, { complete: true }).payload;

		return id == user.id || user.userType === 'admin';
	}
};

module.exports = Utils;