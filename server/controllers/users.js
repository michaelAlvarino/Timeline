'use strict';
/* globals module, console, require */
module.exports = function (app, pg, connectionString) {
	const bcrypt 	= require('bcrypt');
	const User 		= require('./../models/User.js');

	app.get('/api/users/:id(\\d+)', (req, res) => {
		var id = req.params.id;
		User.find(id, (user) => {
			res.json(user);
		});
	});

	// test using curl...  curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:8000/api/AddEvent
	app.post('/api/users/create', (req,res) => {
		console.log(req.body);
		var user = new User(req.body.user); 

		var _ = (user, res) => {
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

		saveUser(user);
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