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
const env = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[env]);
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
if (env === 'development') {
    app.use(morgan('combined'));
}

// =============================================
// Request / Response hooks
// =============================================
app.use((req, res, next) => {
    var path = req._parsedUrl.path,
        timelinetoken = req.body.timelinetoken || req.headers.timelinetoken;

    if (['PUT', 'PATCH', 'POST', 'DELETE'].indexOf(req.method) !== -1 || 
        ['/api/users/test'].indexOf(path) !== -1) {
        console.log('Request is put, post, patch, delete, or a special route that must be authenticated');
        console.log('Check for a valid timeline token here');
        console.log('token: ' + timelinetoken);

        // if (!valid) {
        //     res.status(403).json({
        //         status: 403,
        //         success: false,
        //         errors: ['Invalid credentials']
        //     })
        // }
    }
})

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
