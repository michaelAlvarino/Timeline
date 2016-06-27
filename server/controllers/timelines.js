'use strict';
/* globals module, require */

module.exports = function(app){
	const Timeline = require('./../models/Timeline.js');

	app.get('/api/timelines/:id(\\d+)', (req, res) => {

		var id = req.params.id;

		Timeline.query().findById(id)
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
};