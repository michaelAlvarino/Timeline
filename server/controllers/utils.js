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
		var authentication = [
				!token,
				!jwt.verify(token, config.tokenSecretKey)
			], 
			length = authentication.length,
			index;

		for (index = 0; index < length; index++) {
			if (authentication[index]) {
				return false;
			}
		}

		return true;
	},

	/**
	 * Check that the user has a signed JSON token with the same ID
	 * 
	 * @param	{[int|string]}	id		ID of the user to alter
	 * @param	{[string]}		token	String reprsenting a hashed JSON Web Token
	 */
	authenticateUserWithId: (id, token) => {
		if (!Utils.authenticateUser(token)) return false;

		var user = jwt.decode(token, { complete: true }),
			authentication = [
				id == user.id,
				['user', 'mod'].indexOf(user.userType) >= 0
			], 
			length = authentication.length,
			index;

		for (index = 0; index < length; index++) {
			if (authentication[index]) {
				return false;
			}
		}

		return true;
	}
};

module.exports = Utils;