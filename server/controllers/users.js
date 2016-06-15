'use strict';
/* globals module, console, require */
module.exports = function (app, pg, connectionString) {
	const bcrypt = require('bcrypt');
	/**
	 * Route to get user information
	 *
	 * req {Request}
	 * res {Response}
	 */
	app.get('/api/users/:id(\\d+)', (req, res) => {
		console.log(req.body);
		console.log(connectionString);
		console.log(req.params);

		pg.connect(connectionString, (err, client, done) => {
			if (err) {
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}

			var query = client.query(
				"SELECT * FROM users WHERE id = $1", 
				[ req.params.id ]
			);

			// On success
			query.on('row', (row) => {
				return res.status(200).json(row);
			});

			// On failure
			query.on('end', () => {
				return res.status(404).json("User not found :(");
			});
		});
	});

	// test using curl...  curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:8000/api/AddEvent
	//TODO check if email already exists
	//TODO validate inputs
	//TODO does encryption happen here or at the front end? probably here...
	app.post('/api/users/create', (req,res) => {
		console.log(req.body);
		var user = req.body.user, 
				errors = validateUser(user);

		if (errors.length !== 1) {
			return res.status(403).json(errors);
		}

		var passwordDigest = bcrypt.hashSync(
			user.password, 
			bcrypt.genSaltSync()
		);

		var now = new Date();
		var data = {
			email: req.body.email, 
			password_digest: passwordDigest,
			user_type: "user",
			created_date: now.toISOString(),
			updated_date: now.toISOString()
		};
		
		pg.connect(connectionString, (err, client, done) => {
			if(err){
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}

			client.query("insert into users (email, password_digest, user_type, created_date, updated_date) values($1, $2, $3, $4, $5);", [data.email, data.password_digest, data.user_type, data.created_date, data.updated_date]);
		});

		return res.status(200).json({success: true});
	});

	/*
	 * Returns an array of errors
	 */
	var validateUser = (user) => {
		var emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i),
			errors = [],
			validation = {
			"No user object found": !user,
			"Email is required": !user.email,
			"Email already registered": false, // TODO: Query the DB to check if the email has been registered
			"Not a valid email": user.email && user.email.search(emailRegex) === -1,
			"Password requires 1 digit, 1 uppercase letter, and 1 lowercase letter": user.password.search(/\d/) === -1 ||
				user.password.search(/[a-z]/) === -1 || user.password.search(/[A-Z]/) === -1
		}, key;

		for (key in validation) {
			if (validation.hasOwnProperty(key) && validation[key]) {
				errors.push(key);
			}
		}

		return errors;
	};
};