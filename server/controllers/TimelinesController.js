'use strict';
/* globals module, require */

const Timeline = require('./../models/Timeline.js');
const AuthHelper = require('../helpers/AuthHelper.js');

module.exports = function(app){


	app.get('/api/timelines/:id(\\d+)', (req, res) => {

		var id = req.params.id;

		Timeline.query().findById(id).where('enable', '=', 't')
			.then((data) => {
				if (data.enable) {
					res.json(data);
				} else {
					res.status(404).json('timeline does not exist');
				}
			})
			.catch((error) => {
				res.json(error);
			});
	});

	app.post('/api/timelines/create', (req, res) => {
		var dt = new Date().toISOString();
		var timeline = {
			name: req.body.name,
			enable: true,
			createdDate: dt,
			updatedDate: dt
		};

		Timeline.query().insertAndFetch(timeline)
			.then((data) => { 
				if (data) {
					res.json(data);
				} else {
					res.status(404).json('timeline creation failed');
				}
			})
			.catch((error) => {
				res.json(error); 
			});
	});

	// instead of deleting timelines, just disable them to allow for easy re-addition.
	// is there any reason we would actually want to permanently delete a timeline?
	// do we have some weird obligation to do it like we would with users?
	// 
	// Nah, this is a good strategy
	// also means that in our get, we should only return timelines that are enabled
	app.delete('/api/timelines/:id(\\d+)',(req, res) => {
		Timeline.query()
			.patchAndFetchById(req.params.id, { enable: false })
			.then((data) => { 
				res.json('success, timeline disabled'); 
			})
			.catch((error) => { 
				res.json(error);
			});
	});

	app.put('/api/timelines/:id(\\d+)', (req, res) => {
		var token 	= req.headers.timelinetoken,
			id 		= req.params.id;

		if(!AuthHelper.authenticateUser(token)){
			res.status(403).json({
				success: false,
				status: 403,
				errors: ['Invalid Credentials']
			})
		}

		Timeline.query()
			.findById(id)
			.then((timeline) => {
				var updatedTimeline = Timeline.updateTimeline(timeline, req.body);
				res.json(updatedTimeline);
			})
			.catch((error) => {
				res.json(error);
			})
	});
};