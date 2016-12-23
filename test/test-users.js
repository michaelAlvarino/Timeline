/* globals process, require, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const chai		= require('chai');
const assert	= chai.assert;
const User		= require('../server/models/User');

const validUser = {
	'password': 'passwordPASSWORD1234567890',
	'passwordConfirmation': 'passwordPASSWORD1234567890',
	'email': 'email@example.com',
	'userType':	'user'
};

describe('User', () => {
	describe('#validateUser', () => {
		it ('should return an object if valid', () => {
			let user = Object.assign({}, validUser)
			
			user = User.validateUser(user);

			assert.equal(user.email, 'email@example.com');
			assert.equal(user.userType, 'user');
			assert.typeOf(user.passwordDigest, 'string');
			assert.typeOf(user.createdDate,	'string');
			assert.typeOf(user.updatedDate,	'string');
			assert.typeOf(user.password, 'undefined');
		});

		it('should not be valid if userAttributes are empty', () => {
			let user = User.validateUser({})

			assert.isAbove(user.errors.length, 0)
			assert.typeOf(user.createdDate, 'undefined')
			assert.typeOf(user.updatedDate, 'undefined')
		});

		it('should not be valid if email is invalid', () => {
			let user = Object.assign({}, validUser, {email: 'jafart.com'})
			user = User.validateUser(user)

			assert.isAbove(user.errors.length, 0)
			assert.typeOf(user.createdDate, 'undefined')
			assert.typeOf(user.updatedDate, 'undefined')
		});

		it('should not be valid without a password', () => {
			let user = Object.assign({}, validUser, {password: null})
			user = User.validateUser(user)

			assert.isAbove(user.errors.length, 0)
			assert.typeOf(user.createdDate, 'undefined')
			assert.typeOf(user.updatedDate, 'undefined')
		});
	});
});
