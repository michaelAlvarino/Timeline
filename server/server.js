/* globals module, require, __dirname */
'use strict';
// =============================================
// imports...
// =============================================
const express		= require('express');
const path			= require('path');
const knexConfig	= require('../knexfile.js');
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
// configuration
// =============================================
const config = {
    static_path: path.normalize(__dirname + '/../public'),
    port: 8000,
    env: process.env.NODE_ENV || 'development',
    authPaths: ['/api/timelineItem', '/api/timelines', '/api/users']
    // maybe add knex here? i don't know if knexConfig[this.env] will work
}

// =============================================
// connect to the db
// =============================================
const knex = Knex(knexConfig[config.env]);
Model.knex(knex);
app.knex = knex;

// =============================================
// connect to redis
// =============================================
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// =============================================
// middleware
// =============================================
require('./middleware.js')(app, config, redisClient);//(app, static_path, env);

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
app.listen(config.port);

module.exports = app;
