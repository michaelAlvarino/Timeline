'use strict';
/* globals module, require */

const jwt			= require('jsonwebtoken')
const config		= require('../../config')
const bcrypt		= require('bcrypt')
const model			= require('objection').Model
const AuthHelper	= require('../helpers/AuthHelper')
const Response		= require('../helpers/Response')

// Class constants
const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const USER_TYPES  = { user: 'user', mod: 'mod', therock: 'therock', admin: 'admin' }

// ES6 translates this to the following:
// function User() {
// 		// do stuff
// }; 
// User.prototype = Object.create(model.prototype);

/**
 * @class User
 */
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

	static validateUser(user, createPassword = true) {
		let errors = []
		let email = user.email
		let password = user.password 
		let passwordConfirmation = user.passwordConfirmation
		let userType = user.userType

		// Check email
		errors = errors.concat(getEmailErrors(email))
		// Check password but only if creating a new password
		if (createPassword) {
			errors = errors.concat(getPasswordErrors(password, passwordConfirmation))
		}

		// Check user type
		if (!userType || !USER_TYPES.hasOwnProperty(userType)) {
			user.userType = USER_TYPES.user
		}

		if (errors.length === 0) {
			let now = new Date().toISOString();
			user.createdDate = now
			user.updatedDate = now

			// TODO: Determine if creating the passwordDigest should even happen in the 
			// 			validate step
			if (createPassword) {
				user.passwordDigest = createPasswordDigest(password)
				delete user.password
			}
		}

		return Object.assign({errors: errors}, user)
	}

	static updateUser (user, userAttributes) {
		// TODO: Allow users to update their password
		// let updatePassword = !!userAttributes.oldPassword
		// hasCorrectPassword(userAttributes.oldPassword, user.passwordDigest)

		let updatedUser = User.validateUser(Object.assign({}, user, userAttributes))

		return uniqueEmail(userAttributes.email)
			.then(emailIsUnique => {
				return new Promise((fulfill, reject) => {
					if (updatedUser.errors.length === 0) {
						fulfill(updatedUser)
					} else {
						reject(updatedUser.errors)
					}
				})
			})
			.catch(data => {
				return new Promise ((fulfill, reject) => {
					updatedUser.errors.push('Email already taken')

					return reject(updatedUser.errors)
				})
			})
	}

	static createUser(userAttributes) {
		let user = User.validateUser(userAttributes)

		return uniqueEmail(userAttributes.email)
			.then(emailIsUnique => {
				return new Promise ((fulfill, reject) => {
					if (user.errors.length === 0) {
						fulfill(user)
					} else {
						reject(user.errors)
					}
				})
			})
			.catch((data) => {
				return new Promise ((fulfill, reject) => {
					user.errors.push('Email already taken')

					return reject(data)
				})
			})
	}

	// should return true false, not a new jwt if it turns out to be false
	// still return a promise with true or false
	static findByCredentials (email, password) {
		return User.query()
			.where('email', email)
			.then((users) => {
				return new Promise((fulfill, reject) => {
					if (users.length === 1 && hasCorrectPassword(password, users[0].passwordDigest)) {
						var token = AuthHelper.generateJWT({
							id: users[0].id,
							userType: users[0].userType
						});

						fulfill(token);
					} else {
						reject({
							status: 403,
							success: false,
							errors: [ 'Invalid credentials' ]
						});
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
 * @memberOf User
 * @param  {string}	password
 * @return {string}
 */
const createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

/**
 * Returns true if a password matches a given BCrypt hashed password digest
 * 
 * @memberOf User
 * @param	{string}	password
 * @param	{string}	passwordDigest
 * @return	{boolean}
 */
const hasCorrectPassword = (password, passwordDigest) => {
	return bcrypt.compareSync(password, passwordDigest);
};

/**
 * Returns an object with the keys as requirement descriptions and the values as the validity
 * 
 * @memberOf User
 * @param	{string}	password
 * @param	{string}	passwordConfirmation
 * @return	{Object}
 */
const getPasswordValidations = (password, passwordConfirmation) => {
	return {
		'Password required':	
			!!password,
		'Password must be at least 9 characters long':
			!!password && (password.length > 8),
		'Password requires 1 lower case letter, 1 upper letter, and 1 number': 
			!!password && (password.search(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/) >= 0),
		'Password does not match password confirmation':
			password === passwordConfirmation
	}
}

/**
 * Returns an object with the keys as requirement descriptions and the values as the validity
 * 
 * @memberOf User
 * @param	{string}	email
 * @return	{Object}
 */
const getEmailValidations = (email) => {
	return {
		'Email required': !!email,
		'Email is not valid': !!email && (email.search(EMAIL_REGEX) >= 0)
	}
}

/**
 * Returns true if the password is valid
 * 
 * @param	{string}	password
 * @param	{string}	passwordConfirmation
 * @return	{bool}
 */
const isValidPassword = (password, passwordConfirmation) => {
	let passwordValidations = getPasswordValidations(password, passwordConfirmation)

	for (let key in passwordValidations) {
		if (passwordValidations.hasOwnProperty(key) && !passwordValidations[key]) {
			return false
		}
	}

	return true
}

/**
 * Gets errors for a password
 * 
 * @memberOf User
 * @param	{string}	password
 * @param	{string}	passwordConfirmation
 * @return	{Array}
 */
const getPasswordErrors = (password, passwordConfirmation) => {
	let errors = []
	let passwordValidations = getPasswordValidations(password, passwordConfirmation)

	for (let key in passwordValidations) {
		if (passwordValidations.hasOwnProperty(key) && !passwordValidations[key]) {
			errors.push(key)
		}
	}

	return errors
}

/**
 * Gets errors for an email
 * 
 * @param  {string} email
 * @return {Array}
 */
const getEmailErrors = (email) => {
	let errors = []
	let emailValidations = getEmailValidations(email)

	for (let key in emailValidations) {
		if (emailValidations.hasOwnProperty(key) && !emailValidations[key]) {
			errors.push(key)
		}
	}

	return errors
}

/**
 * Returns a Promise that fulfills when an email is unique. Still not used
 * 
 * @memberOf User
 * @param	{string}	email
 * @return	{Promise}
 */
const uniqueEmail = (email) => {
	return User.query()
		.where('email', email)
		.then(users => {
			return new Promise ((fulfill, reject) => {
				if (users.length > 0) {
					return reject(false);
				} else {
					return fulfill(true);
				}
			})
		})
		.catch((err) => {
			return new Promise((fulfill, reject) => {
				return reject(err);
			})
		})
}
/* end region private methods */

module.exports = User;