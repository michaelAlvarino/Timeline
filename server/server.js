/* globals module, require, __dirname */
'use strict';
// =============================================
// imports...
// =============================================
const express		= require('express');
const path			= require('path');
const morgan		= require('morgan');
const bodyParser	= require('body-parser');
const knexConfig	= require('./knexfile.js');
const objection		= require('objection');
const Knex			= require('knex');
const Model			= objection.Model;
const redis			= require("redis");
const redisClient	= redis.createClient();
const bluebird		= require('bluebird');
const Utils			= require('./helpers/Utils');

// =============================================
// create the app
// =============================================
var app = express();

// =============================================
// connect to the db
// =============================================
const knex = Knex(knexConfig.development);
Model.knex(knex);
app.knex = knex;

// =============================================
// connect to redis
// =============================================
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
app.use(morgan('combined'));

// =============================================
// routing
// =============================================
app.get('/', (req,res) => {
	res.sendFile(path.normalize(static_path + '/index.html'));
});

require('./controllers/UsersController')(app, redis, redisClient);
require('./controllers/TimelinesController')(app, redis, redisClient);
require('./controllers/AuthenticationController')(app, redis, redisClient);
require('./controllers/TimelineItemController')(app, redis, redisClient);

// =============================================
// run the app
// =============================================
app.listen(port);

module.exports = app;
