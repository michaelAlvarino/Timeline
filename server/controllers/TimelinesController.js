'use strict';
/* globals module, require */

const Timeline 		= require('./../models/Timeline.js');
const AuthHelper 	= require('../helpers/AuthHelper.js');
const Utils 		= require('../helpers/Utils.js');

module.exports = function(app){


	/**
	 * GET route for Timeline object
	 *
	 * @memberOf	TimelinesController
	 * @function
	 * @name		/api/timelines/:id
	 */
	app.get('/api/timelines/:id(\\d+)', (req, res) => {

		var id = req.params.id;

		Timeline.query()
		.findById(id).where('enable', '=', 't')
			.then((data) => {
				if(data && data.enable === true){
					return res.json({
						success: true,
						data: data
					});
				} else {
					return res.status(404).json({
						errors: ['timeline not found']
					});
				}
			})
			.catch((error) => {
				return res.status(404).json({
					errors: ['timeline not found']
				});
			});
	});

	app.post('/api/timelines/create', (req, res) => {
		var dt = new Date().toISOString(),
		token = (req.body.timelinetoken || req.headers.timelinetoken),
		timeline = {
			name: req.body.name,
			enable: true,
			createdDate: dt,
			updatedDate: dt
		};

console.log(AuthHelper.authenticateUser(token))
		if(token && AuthHelper.authenticateUser(token)){
			Timeline.query().insertAndFetch(timeline)
				.then((data) => { 
					if(data){
						return res.json(data);
					}

					return res.status(404).json({
						success: false,
						errors: ['Timeline not found']
					})
				})
				.catch((error) => {
					return res.status(404).json({
						success: false,
						errors: error
					}); 
				});
		} else {
			res.status(500).json({
				errors: ['Invalid Credentials']
			}); 
		}
	});

	// instead of deleting timelines, just disable them to allow for easy re-addition.
	// is there any reason we would actually want to permanently delete a timeline?
	// do we have some weird obligation to do it like we would with users?
	// 
	// Nah, this is a good strategy
	// also means that in our get, we should only return timelines that are enabled
	app.delete('/api/timelines/:id(\\d+)',(req, res) => {
		var token 	= req.headers.timelinetoken,
			id 		= req.params.id;

		if(!AuthHelper.authenticateUser(token)){
			return res.status(403).json({
				success: false,
				errors: ['Invalid Credentials']
			});
		}	

		Timeline.query()
			.patchAndFetchById(id, { enable: false })
			.then((data) => { 
				return res.json({
					success: true,
					data: ['success, timeline disabled']}
				); 
			})
			.catch((error) => { 
				return res.status(500).json({
					errors: [error]
				});
			});
	});

	app.put('/api/timelines/:id(\\d+)', (req, res) => {
		var token 	= req.headers.timelinetoken,
			id 		= req.params.id;

		if(!AuthHelper.authenticateUser(token)){
			return res.status(403).json({
				success: false,
				errors: ['Invalid Credentials']
			});
		}

		Timeline.query()
			.findById(id)
			.then((timeline) => {
				var updatedTimeline = Timeline.updateTimeline(timeline, req.body);
				return res.json(updatedTimeline);
			})
			.catch((error) => {
				return res.json(error);
			})
	});
};