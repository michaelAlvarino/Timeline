'use strict';
/* globals module, require */

//const BaseModel = require('./BaseModel.js');
const bcrypt	= require('bcrypt');
const model = require('objection').Model;

// Private instance variables
var emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);

class User extends model{
	// es6 translates this to function User(){} User.prototype = Object.create(model.prototype);
	static get tableName(){ return 'users' }
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
}

var _createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

module.exports = User;