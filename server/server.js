/* globals require, console */
'use strict';
// =============================================
// imports...
// =============================================
const express = 	require('express');
const path = 		require('path');
const morgan = 		require('morgan');
const bodyParser =  require('body-parser');
const pg =			require('pg');
const config =      require('../config.json');
const knexConfig = 	require('./knexfile.js');
const objection =	require('objection');
const knex =		require('knex');
const model =		objection.Model;

// =============================================
// connect to the db
// =============================================
const dbPassword = config.dbPassword;
const dbUsername = config.dbUsername;
const connectionString = "postgres://" +  dbUsername + ":" + dbPassword + "@localhost/timeline";
console.log("Postgres Username: " + dbUsername, "Postgres password: " + dbPassword);
const _knex = knex(knexConfig.development);
model.knex(_knex);

// =============================================
// create the app
// =============================================
var app = express();

// =============================================
// configuration
// =============================================
const static_path = 	path.normalize(__dirname + '/../public');
const port =			8000;

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

// Users Controller
require('./controllers/users.js')(app, pg, connectionString);
// =============================================
// run the app
// =============================================
app.listen(port);

