'use strict';
/* globals module, require */

const BaseModel = require('./BaseModel.js');
const bcrypt	= require('bcrypt');

const emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
	
class User extends BaseModel {
	constructor (attributes) {
		if (typeof attributes === 'undefined') {
			attributes = {};
		}

		super();

		this.setEmail(attributes.email)
			.setPassword(attributes.password)
			.setUserType(attributes.user_type);
	}

	getValidations () {
		// This doesn't work yet
		var uniqueEmail = (user) => {
			var unique = true;
			user.pg.connect(user.connectionString, (err, client, done) => {
				if (err){
					done();
					console.log(err);
				}

				var query = client.query("SELECT * FROM users WHERE email = $1;", [ user.email ]);

				query.on('row', (row) => {
					console.log(row);
					unique = false;
				});
			});

			return unique;
		}

		return {
			'Email is required': !this.email,
			'Email already registered': this.email && !uniqueEmail(this),
			'Not a valid email': this.email && this.email.search(emailRegex) === -1,
			'Password is required': !this.password,
			'Password requires 1 digit, 1 uppercase letter, and 1 lowercase letter': !!this.password && (this.password.search(/\d/) === -1 || this.password.search(/[a-z]/) === -1 || this.password.search(/[A-Z]/) === -1),
			'Password must be greater than 8 characters': !!this.password && this.password.length < 9
		};
	}

	setEmail (email) {
		if (typeof email !== 'string') {
			return this;
		}

		this.email = email;

		return this;
	}

	setPassword (password) {
		if (typeof password !== 'string') {
			return this;
		}

		this.password = password;

		return this;
	}

	setUserType (userType) {
		if (typeof userType !== 'string') {
			this.userType = 'user';
			return this;
		}

		this.userType = userType;

		return this;
	}

	createPasswordDigest () {
		this.passwordDigest = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
	}

	save () {
		if (this.isValid()) {
			var now = new Date();
			this.createPasswordDigest();

			this.pg.connect(this.connectionString, (err, client, done) => {
				if (err){
					done();
					console.log(err);
				}

				client.query("INSERT INTO users (email, password_digest, user_type, created_date, updated_date) values ($1, $2, $3, $4, $5);", 
					[
						this.email, 
						this.passwordDigest, 
						this.userType, 
						now.toISOString(), 
						now.toISOString()
					]
				);
			});

			return true;
		} else {
			return false;
		}
	}
}

module.exports = User;