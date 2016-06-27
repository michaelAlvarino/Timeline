'use strict';

module.exports = function (app) {
	const bcrypt 	= require('bcrypt');
	const User 		= require('./../models/User.js');

	app.get('/api/users/:id(\\d+)', (req, res) => {
		var id = req.params.id;
		User.query().findById(id)
		.then(
			(data) => { 
				if(data){
					res.json(data);
				}
				else{
					res.json('user not found');
				}
			},
			(error) => { 
				res.status(500);
				res.json(error); 
			}
		);
	});

	app.post('/api/users/create', (req,res) => {
		// hash passwords
		var validatedUser = User.validateUser(req.body);
		if(validatedUser === false){
			res.json('user creation failed validation'); // change to specify validation failure
		}
		User.query()
		.insertAndFetch(validatedUser)
		/*
			this generates an insert statement where the column names are the object keys and values are the associated values
		*/
		.then(
			(data) => {
				if(data){
					res.json(data);
				}
				else{
					res.json('user creation failed');
				}
			},
			(error) => {
				res.status(500);
				res.json(error);
			}
		)
	});

	app.delete('/api/users/:id(\\d+)', (req, res) => {
		User.query()
		.deleteById(req.params.id)
		.then((data) => {
			if(data){
				res.json(data);
			}
		}, (error) => {
			res.json('deletion failed')
		});
	});

	// users can only update email and password, we will handle userType later
	// users need to be logged in to update their own account. 
	// how do we handle user auth?
	app.put('/api/users/:id(\\d+)'), (req, res) => {
/*		var validatedUser = User.validateUser(req.body);
		if(validatedUser === false){
			res.json('user update failed');
		}
		User.query()
		.patchAndFetchById({email: validatedUser.email,
							passwordDigest: validatedUser.passwordDigest,
							updatedDate: validatedUser.updatedDate
						})
		.then((data) => {
			if(data){
				res.json(data);
			}
		},
			(error) => {
				res.status(400);
				res.json(error);
			})*/
	}
};