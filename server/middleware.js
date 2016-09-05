'use strict';

const express       = require('express');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const AuthHelper    = require('./helpers/AuthHelper');

module.exports = (app, config) => {

    app.use(express.static(config.static_path));
    app.use(bodyParser.json());

    if (config.env === 'development') {
        app.use(morgan('combined'));
    }

    // =============================================
    // Request / Response hooks
    // =============================================
    app.use(config.authPaths, (req, res, next) => {
        var path = req._parsedUrl.path,
            token = req.body.timelinetoken || req.headers.timelinetoken;
        // should require authentication for get requests on user data?
        if ((['PUT', 'PATCH', 'POST', 'DELETE'].indexOf(req.method) !== -1)
            // shouldn't require login to create a new user
            && req.originalUrl != '/api/users/create') {

            // authentication status
            var authenticated = AuthHelper.authenticateUser(token);
            if (!authenticated /* and they are NOT in the blacklist table */) {
                return res.status(403).json({
                    success: false,
                    errors: ['Invalid credentials']
                })
            } else if(authenticated){
                next();
            }
        } else {
            next();
        } 

    })
}