'use strict';
/* globals module, require */

const jwt		= require('jsonwebtoken');
const config	= require('../../config');
const bcrypt	= require('bcrypt');
const model		= require('objection').Model;

/* start region private variables */
var emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
/* end region private variables */

// ES6 translates this to function User(){}; User.prototype = Object.create(model.prototype);
class User extends model {
	static get tableName () { 
		return 'users'; 
	}

	static get jsonSchema () {
		return {
			type: 'object',
			required: ['email','passwordDigest'],

			properties: {
				id: {type: 'integer'},
				passwordDigest: {type: 'string', minLength: 1, maxLength: 255},
				email: {type: 'string', format: 'email', minLength: 5, maxLength: 255, pattern: '^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$'},
				userType: { type: 'string', pattern: '^user$|^mod$|^admin$|^therock$' },
				createdDate: {type: 'string', format: 'date-time'},
				updatedDate: {type: 'string', format: 'date-time'}
			}
		};
	}

	static validateUser(userAttributes) {
		if(!userAttributes.password || !userAttributes.email || 
			(userAttributes.email.search(emailRegex) === -1)) { // search takes the regex and returns the location or -1 on failure
			return false;
		}

		var dt = new Date().toISOString();
		userAttributes.passwordDigest = _createPasswordDigest(userAttributes.password); // We re-hash the passwords on PUTS / PATCH, we only need to do that if the user is deliberately changing their password
		userAttributes.createdDate = dt;
		userAttributes.updatedDate = dt;
		delete userAttributes.password;

		return userAttributes;
	}

	static updateUser (user, userAttributes) {
		var errors = [];

		// Resetting password
		if (userAttributes.passwordConfirmation && userAttributes.password) {
			if (!_hasCorrectPassword(userAttributes.passwordConfirmation, user.passwordDigest)) {
				return {
					success: false,
					errors: ["Invalid credentials"],
					status: 403
				};
			}
			var validPassword = _isPasswordValid(userAttributes.password);

			if (validPassword.success) {
				user.passwordDigest = validPassword.data;
			} else {
				errors.concat(validPassword.errors);
			}
		}

		// Check user type
		// This gets checked in JSON Schema, but I'm bad at handling those errors
		// if (userAttributes.userType && 
		// 	['user', 'mod', 'admin', 'therock'].indexOf(userAttributes.userType) > 0) {
		// 	user.userType = userAttributes.userType;
		// } else if (userAttributes.userType) {
		// 	errors.push('Invalid user type');
		// }

		// Check email
		// This gets checked in JSON Schema, but I'm bad at handling those errors
		// if (userAttributes.email && userAttributes.email.search(emailRegex) >= 0) {
		// 	user.email = userAttributes.email;
		// } else if (userAttributes.email) {
		// 	errors.push('Invalid email');
		// }

		if (errors.length > 0) {
			return {
				success: false,
				status: 400,
				errors: errors
			};
		}

		user.updatedDate = (new Date()).toISOString();

		return {
			success: true,
			status: 200,
			data: user
		};
	}

	static createUser (userAttributes) {
		var result = {
				success: true,
				data: null,
				errors: []
			},
			validPassword = _isPasswordValid(userAttributes.password);

		if (!validPassword.success) {
			result.errors.concat(validPassword.errors);
			result.success = false;
		}

		if (!userAttributes.userType) {
			userAttributes.userType = 'user';
		}

		var dt = new Date().toISOString();

		result.data = {
			email:			userAttributes.email,
			passwordDigest: validPassword.data,
			userType:		userAttributes.userType,
			createdDate:	dt,
			updatedDate:	dt
		};

		return result;
	}

	static findByCredentials (email, password) {
		return User.query()
			.where('email', email)
			.then((users) => {
				return new Promise((fulfill, reject) => {
					if (users.length === 1 && _hasCorrectPassword(password, users[0].passwordDigest)) {
						var token = jwt.sign({
								id: users[0].id,
								userType: users[0].userType
							}, 
							config.tokenSecretKey,
							{
							expiresIn: '1 day'
						});

						fulfill(token);
					} else {
						reject('Invalid credentials');
					}
				});
			})
			.catch((errors) => {
				return new Promise((fulfill, reject) => {
					reject(errors);
				});
			});
	}
}

/* start region private methods */
/**
 * Creates a new BCrypt hashed password digest
 * 
 * @param  {[string]}	password
 * @return {[string]}
 */
var _createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

/**
 * Returns true if a password matches a given BCrypt hashed password digest
 * 
 * @param	{[string]}	password		
 * @param	{[string]}	passwordDigest
 * @return	{[boolean]}
 */
var _hasCorrectPassword  = (password, passwordDigest) => {
	return bcrypt.compareSync(password, passwordDigest);
};

/**
 * Returns an object with the keys as requirement descriptions and the values as the validity
 * 
 * @param	{[string]}	password
 * @return	{[object]}
 */
var _getPasswordValidations = (password) => {
	return {
		'Password required':	
			password,
		'Password must be at least 9 characters long':
			password && password.length > 8,
		'Password requires 1 lower case letter, 1 upper letter, and 1 number': 
			password && password.search(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/) >= 0
	};
};

/**
 * Validates if a password is valid
 * 
 * @param	{[string]}	password
 * @return	{[object]}
 */
var _isPasswordValid = (password) => {
	var result = {
			success: true,
			data: null,
			status: 200,
			errors: []
		},
		passwordValidations = _getPasswordValidations(password), 
		key;

	for (key in passwordValidations) {
		if (passwordValidations.hasOwnProperty(key) && !passwordValidations[key]) {
			result.success = false;
			result.status = 400;
			result.errors.push(key);
		}
	}

	if (result.success) result.data = _createPasswordDigest(password);

	return result;
};
/* end region private methods */

module.exports = User;