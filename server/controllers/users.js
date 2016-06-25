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
		// hash passwords
		var validatedUser = User.validateUser(req.body);
		if(validatedUser === false){
			res.json('user creation failed validation'); // change to specify validation failure
		}
		User.query()
		.insertAndFetch(validatedUser)
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

/*		var _ = (user, res) => {
			if (user.save()) {
				res.json(user);
			} else {
				res.json(user.errors);
			}
		}

		var saveUser = (user) => {
			setTimeout(() => {
				if (user.uniqueEmail !== null) {
					_(user, res);
					return res;
				} else {
					saveUser(user);
				}
			}, 0);
		};

		saveUser(user);*/
	});

	app.delete('/api/users/:id(\\d+)', (req, res) => {
		console.log(req.body);

		User.find(req.params.id, (data) => {
			var user = new User(data);

			if (user && user.isCorrectPassword(req.body.password)) {
				user.destroy(() => {
					res.json('User ' + req.params.id + ' deleted');
				});
			} else {
				res.status(403).json({success: false});
			}
		});

	});
};