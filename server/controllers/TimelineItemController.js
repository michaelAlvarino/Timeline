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
				if (data) {
					return res.json({
						success: true,
						data: data
					});
				}
				
				return res.status(404).json({
					success: false,
					data: data,
					message: 'TimelineItem not found'
				})
			})
			.catch((error) => {
				res.status(500).json({
					success: false,
					data: null,
					message: error
				});
			});
	});

	app.post('/api/timelineItem/create', (req, res) =>{

		var dt = new Date().toISOString(),
			token = req.body.token,
			timelineItem;


		if(token && AuthHelper.authenticateUser(token)){
			timelineItem = {
				content: timelineItem.content,
				title: timelineItem.title,
				imageUrl: timelineItem.imageUrl,
				userId: AuthHelper.getUserId(token), // how do we get userId from the token?
				status: timelineItem.status || null,
				createdDate: dt,
				updatedDate: dt
			};

		}

		TimelineItem.query()
		.insertAndFetch(timelineItem)
		.then((data) => {
			if(data)
				res.status(201).json(data);
			// query was successful, but didn't return anything
			res.status(404).json({
				error: ['Item Not Found']
			})
		},
		(errors) => {
			res.status(500).json({
				error: [errors]
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
				status: 403,
				errors: [ 'Invalid credentials' ]  
			});
		}

		TimlineItem.query()
		.patchAndFetchById(id, item)
		.then((data) => {
			if(data)
				res.json(data);
			res.status(404).json({
				data: null
			});
		},
		(error) => {
			res.status(500).json({
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
				status: 403,
				errors: ['Invalid Credentials']
			})
		}

		TimelineItem.query()
		.deleteById(id)
		.then((data) => {
			res.json({
				success: true,
				data: data // should be # deleted rows (1)
			})
		},
		(error) => {
			res.status(500).json({
				success: false,
				error: [error]
			});
		});
	});
};