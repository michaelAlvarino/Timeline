'use strict';
/* globals module, require */

const BaseModel = require('./BaseModel.js');
const bcrypt	= require('bcrypt');
const config 	= require('../../config.json');
const model 	= require('objection').Model;

// Private instance variables
var emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);

// ES6 translates this to function User() {}; User.prototype = Object.create(model.prototype);
class User extends model {
	static get tableName() { 
		return 'users';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['email','passwordDigest'],

			properties: {
				id: {type: 'integer'},
				passwordDigest: {type: 'string', minLength: 1, maxLength: 255},
				email: {type: 'string', minLength: 5, maxLength: 255},
				createdDate: {type: 'string'},
				updatedDate: {type: 'string'}
			}
		};
    }

	static validateUser(userAttributes){
		var errors = [], validations = _getValidations(userAttributes), key;

		for (key in validations) {
			if (validations.hasOwnProperty(key) && validations[key]) {
				errors.push(key);
			}
		}

		return new Promise (fulfill, reject) {
			if (errors.length === 0) {
				var date = new Date().toISOString();
				fulfill({
					email: 			userAttributes.email,
					passwordDigest: _createPasswordDigest(userAttributes.password),
					userType: 		userAttributes.userType,
					createdDate: 	date,
					updatedDate: 	date
				});
			} else {
				reject(errors);
			}
		};
		// if(!userAttributes.password || !userAttributes.email || (userAttributes.email.search(emailRegex) === -1)){// search takes the regex and returns the location or -1 on failure
		// 	return false;
		// }
		
		// var dt = new Date().toISOString();
		// userAttributes.passwordDigest = _createPasswordDigest(userAttributes.password);
		// userAttributes.createdDate = dt;
		// userAttributes.updatedDate = dt;
		
		// delete userAttributes.password;
		
		// return userAttributes;
	}
}

// Private methods
var _createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

var _getValidations = (userAttributes) => {
	// Default each user type to 'user'
	if (typeof userAttributes.userType === 'undefined') {
		userAttributes.userType = 'user';
	}

	var password    = userAttributes.password,
		email 		= userAttributes.email,
		userType	= userAttributes.userType;

	return {
		'Password required': 						!password,
		'Passowrd must be greater than 8 chars': 	password && password.length < 9,
		'Password requires 1 lower case letter': 	password && password.search(/[a-z]/) === -1,
		'Password requires 1 upper case letter': 	password && password.search(/[A-Z]/) === -1,
		'Password requires 1 number': 				password && password.search(/[0-9]/) === -1,
		'Email required':							!email,
		'Email is not valid': 						email && email.search(emailRegex) === -1,
		'User type not valid': 						['user', 'moderator', 'admin', 'theRock'].indexOf(userType) < 0
	}
};

module.exports = User;