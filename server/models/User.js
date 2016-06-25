'use strict';
/* globals module, require */

const BaseModel = require('./BaseModel.js');
const bcrypt	= require('bcrypt');
const config = require('../../config.json');
const model = require('objection').Model;

// Private instance variables
var _password	= null,
	emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);

class User extends model{
	static get tableName(){ return 'users' }
	// es6 translates this to function User(){} User.prototype = Object.create(model.prototype);
	static find(id){
		this.query()
		.where('id','=',id)
	}
	static get jsonSchema () {
	    return {
	      type: 'object',
	      required: ['email'],

	      properties: {
	        id: {type: 'integer'},
	        password: {type: 'string', minLength: 1, maxLength: 255},
	        email: {type: 'string', minLength: 5, maxLength: 255}
	      }
		};
    }
    static validateUser(userAttributes){
    	if(!userAttributes.password || !userAttributes.email || userAttributes.email.search(emailRegex) === -1){// search takes the regex and returns the location or -1 on failure
    		return false;
    	}
    	userAttributes.passwordDigest = _createPasswordDigest(userAttributes.password);
    	userAttributes.createdDate = (new Date()).toISOString();
    	userAttributes.updatedDate = userAttributes.createdDate;
    	delete userAttributes.password;
    	return userAttributes;
    }
}

var _createPasswordDigest = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

module.exports = User;