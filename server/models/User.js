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
				email: {type: 'string', minLength: 5, maxLength: 255},
				createdDate: {type: 'string'},
				updatedDate: {type: 'string'}
			}
		};
	}

	static validateUser(userAttributes) {
		if(!userAttributes.password || !userAttributes.email || (userAttributes.email.search(emailRegex) === -1)){// search takes the regex and returns the location or -1 on failure
			return false;
		}

		var dt = new Date().toISOString();
		userAttributes.passwordDigest = _createPasswordDigest(userAttributes.password);
		userAttributes.createdDate = dt;
		userAttributes.updatedDate = dt;
		delete userAttributes.password;

		return userAttributes;
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
var _createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

var _hasCorrectPassword  = (password, passwordDigest) => {
	return bcrypt.compareSync(password, passwordDigest);
}
/* end region private methods */

module.exports = User;