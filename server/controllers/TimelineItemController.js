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
				res.json({
					success: true,
					data: data,
					message: null
				});
			})
			.catch((error) => {
				res.json({
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
				content: '',
				title: '',
				imageUrl: '',
				userId: 0,
				status: '',
				createdDate: dt,
				updatedDate: dt
			};

//			TimelineItem.query()
//			.insertAndFetch
		}


	});
};