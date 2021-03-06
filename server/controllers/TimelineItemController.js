/* globals module, require */
'use strict';

module.exports = function(app){

	const TimelineItem = require('../models/TimelineItem.js');
	const AuthHelper = require('../helpers/AuthHelper.js');

	app.get('/api/timelineItem/:id(\\d+)', (req, res) => {

		var id = req.params.id;

		TimelineItem.query()
			.findById(id)
			.then((data) => {
				if(data)
					return res.json({
						success: true,
						data: data,
						errors: []
					});
				return res.status(404).json({
					success: false,
					data: null,
					errors: ['timeline item not found']
				});
			})
			.catch((errors) => {
				return res.status(500).json({
					success: false,
					data: null,
					errors: [errors	]
				});
			});
	});

	app.post('/api/timelineItem/create', (req, res) =>{

		var dt = new Date().toISOString();

		var token = req.body.timelinetoken || req.headers.timelinetoken;

		var timelineItem = { // Should abstract this to TimelineItem#valiate or something
			content: req.body.content,
			title: req.body.title,
			imageUrl: req.body.imageUrl,
			userId: AuthHelper.getUserId(token), 
			status: req.body.status || null,
			createdDate: dt,
			updatedDate: dt
		};

		// TODO: this will insert a bunch of nulls when no valid token is input, needs to be fixed
		// Set an early return if the token isn't valid
		TimelineItem.query()
			.insertAndFetch(timelineItem)
			.then((data) => {
				if(data)
					return res.status(200).json({
						success: true,
						data: data,
						errors: []
					});
				return res.status(404).json({
					success: false,
					data: null,
					errors: ['Item Not Found']
				})
			})
			.catch((errors) => {
				return res.status(500).json({
					success: false,
					data: null,
					errors: [errors]
				});
			});
	});

	app.put('/api/timelineItem/:id(\\d+)', (req, res) => {

		var token 	= req.body.token,
		id			= req.params.id,
		item 		= req.body.item;

		if (!token && !AuthHelper.authenticateUserWithId(id, token) && !AuthHelper.isAdmin(token)) {
			return res.status(403).json({ 
				success: false,
				data: null,
				errors: [ 'Invalid credentials' ]  
			});
		}

		TimlineItem.query()
			.patchAndFetchById(id, item)
			.then((data) => {
				if (data) return res.json({
					success: true,
					data: data,
					errors: []
				});

				return res.status(404).json({
					success: false,
					data: null,
					errors: ['404 Not Found']
				});
			})
			.catch((error) => {
				return res.status(500).json({
					success: false,
					data: null,
					errors: [ error ]
				})
			});
	});

	app.delete('/api/timelineItem/:id(\\d+)', (req, res) => {

		var token 	= req.body.token,
		id 			= req.params.id;

		if(!AuthHelper.authenticateUser(token) && !AuthHelper.isAdmin(token)){
			return res.status(403).json({
				success: false,
				data: null,
				errors: ['Invalid Credentials']
			})
		}

		TimelineItem.query()
			.deleteById(id)
			.then((data) => {
				res.json({
					success: true,
					data: data, // should be # deleted rows (1)
					errors: []
				})
			})
			.catch((error) => {
				res.status(500).json({
					success: false,
					data: null,
					errors: [error]
				});
			});
	});
};
