
// =============================================
// imports...
// =============================================
const express = 	require('express');
const path = 		require('path');
const morgan = 		require('morgan');
const bodyParser =  require('body-parser');
const pg =			require('pg');

// =============================================
// connect to the db
// =============================================
const dbpass = process.env.dbpassword;
const connectionString = "postgres://timeline:" + dbpass + "@localhost/timeline";
console.log("Postgres password: " + dbpass);

// =============================================
// create the app
// =============================================
var app = express();

// =============================================
// configuration
// =============================================
const static_path = 	path.normalize(__dirname + '/../public');
const port =			8000

// =============================================
// middleware
// =============================================
app.use(express.static(static_path));
app.use(bodyParser.json());
app.use(morgan('combined'));

// =============================================
// routing
// =============================================
app.get('/', (req,res) => {
	res.sendFile(path.normalize(static_path + '/index.html'));
});

/*create table users(
id 					serial, -- autoincrementing, 4 byte, unsigned integer
email 				varchar(255),
password_digest 	varchar(255),
user_type			varchar(64),
created_date		timestamp,
updated_date		timestamp	
);*/

// test using curl...  curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:8000/api/AddEvent
//TODO check if email already exists
//TODO validate inputs
//TODO does encryption happen here or at the front end? probably here...
app.post('/api/user/create', (req,res) => {
	console.log(req.body);
	console.log(connectionString);
	var now = new Date();
	var data = {
		email: req.body.email, 
		password_digest: req.body.password_digest,
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
	})


})

// =============================================
// run the app
// =============================================
app.listen(port);

