const chai		= require('chai');
const should	= chai.should();
const assert	= chai.assert;
const expect	= chai.expect;
const User		= require('../server/models/User');

const validUser = {
	'password': 'passwordPASSWORD1234567890',
	'email':	'email@example.com',
	'userType':	'user'
};

describe('User', () => {
	describe('#validateUser', () => {
		it ('should return an object if valid', () => {
			var validatedUser = User.validateUser(validUser);

			assert.equal(validatedUser.email,			'email@example.com');
			assert.equal(validatedUser.userType,		'user');

			assert.typeOf(validatedUser.passwordDigest,	'string');
			assert.typeOf(validatedUser.createdDate,	'string');
			assert.typeOf(validatedUser.updatedDate,	'string');
			assert.typeOf(validatedUser.password,		'undefined');
		});

		it('should not be valid if userAttributes are empty', () => {
			assert.equal(User.validateUser({}), false);
		});

		it('should not be valid if email is invalid', () => {
			var invalidUser = Object.assign(validUser);

			invalidUser.email = 'notarealemail.com';
			assert.equal(User.validateUser(invalidUser), false);
		});

		it('should not be valid without a password', () => {
			var invalidUser = Object.assign(validUser);

			invalidUser.password = null;
			assert.equal(User.validateUser(invalidUser), false);
		});
	})
});
