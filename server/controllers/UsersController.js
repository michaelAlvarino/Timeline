'use strict';
/* globals module, require */

const User			= require('./../models/User');
const AuthHelper	= require('./../helpers/AuthHelper');

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
		var user = User.createUser(req.body)
			.then((user) => {
				return User.query().insertAndFetch(user.data);
			})
			.then((data) => {
				if (data) {
					return res.json(data);
				} else {
					return res.status(400).json('User creation failed');
				}
			})
			.catch((error) => {
				return res.status(400).json(error);
			});
		// if (!user.success) {
		// 	return res.status(400).json(user);
		// }

		// User.query()
		// 	.insertAndFetch(user.data)
		// 	.then((data) => {
		// 		if (data) {
		// 			return res.json(data);
		// 		} else {
		// 			return res.status(400).json('User creation failed');
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		return res.status(500).json(error);
		// 	});
	});

	app.delete('/api/users/:id(\\d+)', (req, res) => {
		var token = req.body.timelinetoken || req.header.timelinetoken,
			id = req.params.id;

		if (!AuthHelper.authenticateUserWithId(id, token)) {
			return res.status(403).json({
				success: false,
				status: 403,
				errors: ['Invalid authentication']
			});
		}

		User.query()
			.deleteById(req.params.id)
			.then((data) => {
				if(data){
					res.json(data);
				}
			})
			.catch((error) => {
				res.status(400).json('User deletion failed');
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
		var token 	= req.headers.timelinetoken,
			id		= req.params.id;

		if (!AuthHelper.authenticateUserWithId(id, token) && !AuthHelper.isAdmin()) {
			return res.status(403).json({ 
				success: false,
				status: 403,
				errors: [ 'Invalid credentials' ]  
			});
		}

		User.query()
			.findById(req.params.id)
			.then((user) => {
				var updatedUser = User.updateUser(user, req.body);

				if (updatedUser.success) {
					return User.query().patchAndFetchById(req.params.id, updatedUser.data);
				}

				return res.status(updatedUser.status).json(updatedUser);
			})
			.then((user) => {
				return res.json(user);
			}) 
			.catch((error) => {
				return res.status(400).json({ 
					success: false,
					status: 400,
					message: error 
				});
			});
	});

	app.post('/api/users/test', (req, res) => {
		var email = req.body.email;

		User.testUniqueEmail(email)
			.then((data) => {
				console.log('Being fulfilled!', data);

				return res.json({
					status: 200, 
					data: data,
					success: true
				});
			})
			.catch((data) => {
				console.log('Being rejected!');
				return res.json({
					status: 200, 
					data: data,
					success: false
				});
			});
	});
};