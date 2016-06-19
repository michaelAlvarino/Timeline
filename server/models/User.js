'use strict';
/* globals module, require */

const BaseModel = require('./BaseModel.js');
const bcrypt	= require('bcrypt');

// Private instance variables
var _password	= null,
	emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
	
class User extends BaseModel {
	static getTable () {
		return 'users';
	}

	constructor (attributes) {
		if (typeof attributes === 'undefined') attributes = {};
		super(attributes);
		this.setEmail(attributes.email)
			.setPassword(attributes.password)
			.setPasswordDigest(attributes.passwordDigest || attributes.password_digest)
			.setUserType(attributes.user_type);
		this.table = 'users';
		this.uniqueEmail = null;
		this.hasUniqueEmail();
	}

	getValidations () {
		return {
			'Email is required': 
				!this.email,
			'Email already registered': 
				this.email && this.uniqueEmail === false,
			'Not a valid email': 
				this.email && this.email.search(emailRegex) === -1,
			'Password is required': 
				!this.passwordDigest && !_password,
			'Password requires 1 digit, 1 uppercase letter, and 1 lowercase letter': 
				!this.passwordDigest && _password && 
				(
					_password.search(/\d/)	  === -1 || 
					_password.search(/[a-z]/) === -1 || 
					_password.search(/[A-Z]/) === -1
				),
			'Password must be greater than 8 characters': 
				!this.passwordDigest && _password && _password.length < 9
		};
	}

	setEmail (email) {
		if (typeof email !== 'string') return this;

		this.email = email;

		return this;
	}

	setPassword (password) {
		if (typeof password !== 'string') return this;

		_password = password;

		return this;
	}

	setPasswordDigest (passwordDigest) {
		if (typeof passwordDigest !== 'string' || this.passwordDigest) return this;

		this.passwordDigest = passwordDigest;

		return this;
	}

	setUserType (userType) {
		if (typeof userType !== 'string') userType = 'user';

		this.userType = userType;

		return this;
	}

	hasUniqueEmail () {
		if (this.id) return true;
		
		var user = this;
		user.getPostgres().connect(user.getConnectionString(), (err, client, done) => {
			var isUnique = true, result = null;

			if (err) {
				done();
				console.log(err);
				return false;
			} else {
				var query = client.query(
					'SELECT * FROM users WHERE email = $1', 
					[ user.email ]
				);

				query.on('row', (row) => {
					user.uniqueEmail = false;
				});

				query.on('end', () => {
					user.uniqueEmail = isUnique;
				})
			}
		});
	}

	isCorrectPassword (password) {
		console.log(password, this.passwordDigest);
		return bcrypt.compareSync(password, this.passwordDigest);
	}

	save () {
		if (this.isValid()) {
			if (!this.passwordDigest) this.passwordDigest = _createPasswordDigest(_password);
			var now = new Date();

			// Determine if INSERT statement or UPDATE
			var insertOrUpdate = this.id ? 'INSERT INTO ' : 'UPDATE ';

			this.getPostgres().connect(this.getConnectionString(), (err, client, done) => {
				if (err){
					done();
					console.log(err);
				} else {
					client.query(insertOrUpdate + ' users (email, password_digest, user_type, created_date, updated_date) values ($1, $2, $3, $4, $5);', 
						[
							this.email, 
							this.passwordDigest, 
							this.userType, 
							now.toISOString(), 
							now.toISOString()
						]
					);
				}
			});

			return true;
		} else {
			return false;
		}
	}
}

// Private methods
var _createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

module.exports = User;