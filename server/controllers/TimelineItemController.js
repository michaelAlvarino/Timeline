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
						message: null
					});
				return res.status(404).json({
					success: false,
					errors: ['timeline item not found']
				});
			})
			.catch((errors) => {
				return res.status(500).json({
					success: false,
					errors: [errors]
				});
			});
	});

	app.post('/api/timelineItem/create', (req, res) =>{
		var dt = new Date().toISOString(),
			token = (req.body.timelinetoken || req.headers.timelinetoken),
			timelineItem = timelineItem = { // Should abstract this to TimelineItem#valiate or something
				timelineId: req.body.timelineId,
				content: req.body.content,
				title: req.body.title,
				imageUrl: req.body.imageUrl,
				userId: AuthHelper.getUserId(token), 
				status: req.body.status || null,
				createdDate: dt,
				updatedDate: dt
			};

		if(!AuthHelper.authenticateUser(token)){
			return res.status(403).json({
				status: 403,
				success: false,
				errors: [ 'Invalid credentials' ]
			})
		}

// TODO: this will insert a bunch of nulls when no valid token is input, needs to be fixed
// Set an early return if the token isn't valid
		TimelineItem.query()
			.insertAndFetch(timelineItem)
			.then((data) => {
				if(data)
					return res.status(200).json(data);
				return res.status(404).json({
					success: false,
					error: ['Item Not Found']
				})
			})
			.catch((errors) => {
				return res.status(500).json(errors);
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
				if (data) return res.json(data);

				return res.status(404).json({
					data: null
				});
			})
			.catch((error) => {
				return res.status(500).json({
					success: false,
					status: 500,
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
			})
			.catch((error) => {
				res.status(500).json({
					success: false,
					error: [error]
				});
			});
	});
};
