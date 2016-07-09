/* globals module, require, __dirname */
'use strict';
// =============================================
// imports...
// =============================================
const express		= require('express');
const path			= require('path');
const morgan		= require('morgan');
const bodyParser	= require('body-parser');
const knexConfig	= require('../knexfile.js');
const objection		= require('objection');
const Knex			= require('knex');
const Model			= objection.Model;

// =============================================
// connect to the db
// =============================================
const env = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[env]);
Model.knex(knex);

// =============================================
// create the app
// =============================================
var app = express();
app.knex = knex;

// =============================================
// configuration
// =============================================
const static_path	= path.normalize(__dirname + '/../public');
const port			= 8000;

// =============================================
// middleware
// =============================================
app.use(express.static(static_path));
app.use(bodyParser.json());
if (env === 'development') {
    app.use(morgan('combined'));
}

// =============================================
// routing
// =============================================
app.get('/', (req,res) => {
	res.sendFile(path.normalize(static_path + '/index.html'));
});

require('./controllers/UsersController')(app);
require('./controllers/TimelinesController')(app);
require('./controllers/AuthenticationController')(app);
require('./controllers/TimelineItemController')(app);

// =============================================
// run the app
// =============================================
app.listen(port);

module.exports = app;
