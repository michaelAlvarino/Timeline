'use strict';
/* globals module, console, require */
module.exports = function (app, pg, connectionString) {
	const bcrypt 	= require('bcrypt');
	const User 		= require('./../models/User.js');

	app.get('/api/users/:id(\\d+)', (req, res) => {
		var id = req.params.id;
		var user = User.query().findById(id);
		user.then(
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
		User.validateUser(req.body) // Run custom validations and hash password
			.then((validatedUser) => {
				User.query()
				.insertAndFetch(validatedUser)
				/*
					this generates an insert statement where the column names are the object keys and values are the associated values
				*/
				.then((data) => {
					if(data){
						res.json(data);
					}
					else{
						res.json('user creation failed');
					}
				})
				.catch((error) => {
					res.status(500).json(error);
				})
			})
			.catch((errors) => {
				res.json(errors);
			});
	});

	app.delete('/api/users/:id(\\d+)', (req, res) => {
		console.log(req.body);

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
};