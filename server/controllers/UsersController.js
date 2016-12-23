/* globals module, require */
'use strict'

const User			= require('./../models/User')
const AuthHelper	= require('./../helpers/AuthHelper')
const Response		= require('./../helpers/Response')

module.exports = (app, redis, redisClient) => {
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
		User.createUser(req.body)
			.then(user => User.query().insertAndFetch(user))
			.then(data => {
				if (data) {
					return res.json(data);
				} else {
					return res.status(400).json(Response.custom({
						status: 400,
						errors: ['User creation failed'],
						success: false
					}));
				}
			})
			.catch(errors => {
				return res.status(400).json(Response.custom({
					status: 400,
					errors: errors,
					success: false
				}))
			})
	})

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
		var token = req.body.timelinetoken || req.headers.timelinetoken;
		AuthHelper.verifyToken(token)
			.then((data) => {
				return res.json(data);
			})
			.catch((err) => {
				return res.status(400).json(err);
			})
		// redisClient.set('testKey', 'testValue', redis.print);

		// redisClient.getAsync('potatoCannon')
		// 	.then((data) => {
		// 		if (data === null) {
		// 			return res.status(404).json({
		// 				status: 404,
		// 				success: false,
		// 				errors: ['Key not set']
		// 			});

		// 		}

		// 		return res.status(200).json({
		// 			status: 200,
		// 			success: true,
		// 			data: data
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		return res.status(500).json({
		// 			status: 500,
		// 			success: false,
		// 			errors: err
		// 		});
		// 	});
	});
};