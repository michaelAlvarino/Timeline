'use strict';
/* globals module, require */

const User 	= require('./../models/User.js');
const utils	= require('./utils');

module.exports = (app) => {
	app.get('/api/users/:id(\\d+)', (req, res) => {
		var id = req.params.id;
		User.query()
			.findById(id)
			.then((data) => { 
				if (data) {
					res.json(data);
				} else {
					res.status(404).json('User not found');
				}
			})
			.catch((error) => {
				res.status(500).json(error); 
			});
	});

	app.post('/api/users/create', (req,res) => {
		// hash passwords
		var validatedUser = User.validateUser(req.body);
		if (validatedUser === false) {
			res.json(400).json('user creation failed validation'); // change to specify validation failure
		}

		User.query()
		.insertAndFetch(validatedUser)
		/*
			this generates an insert statement where the column names are the object keys and values are the associated values
		*/
		.then((data) => {
			if (data) {
				res.json(data);
			} else{
				res.json('User creation failed');
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
	});

	app.delete('/api/users/:id(\\d+)', (req, res) => {
		User.query()
		.deleteById(req.params.id)
		.then((data) => {
			if(data){
				res.json(data);
			}
		}, (error) => {
			res.json('deletion failed');
		});
	});

	// users can only update email and password, we will handle userType later
	// users need to be logged in to update their own account. 
	// how do we handle user auth?
	// 
	// We'll build an authentication controller and use JSON Web Tokens
	// Someone logs in and that route will return a signed token that is good for 24 hours
	// Every time someone needs to access a route with authentication, that person will set
	// that token should be set in Request header. We check that header for the token and verify
	// using jsonwebtoken.verify
	app.put('/api/users/:id(\\d+)', (req, res) => {
		var authenticated = utils.authenticateUserWithId(
			req.params.id, 
			req.headers.timelinetoken
		);

		if (!authenticated) {
			return res.status(403).json({success: false});
		}

		var validatedUser = User.validateUser(req.body);

		if (validatedUser === false){
			res.status(400).json('User update failed');
		}

		User.query()
			.patchAndFetchById(req.params.id, {
				email: validatedUser.email,
				passwordDigest: validatedUser.passwordDigest,
				updatedDate: validatedUser.updatedDate,
			})
			.then((data) => {
				if (data){
					res.json(data);
				}
			})
			.catch((error) => {
				res.status(400).json({error});
			});
	});
};