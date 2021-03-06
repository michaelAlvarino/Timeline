/* globals process, require, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const chai		= require('chai');
const chaiHttp	= require('chai-http');
const server	= require('../server/server');
const should	= chai.should();
const User		= require('../server/models/User');
const knex		= server.knex;

chai.use(chaiHttp);

describe('UsersController', () => {
	beforeEach((done) => {
		knex.migrate.rollback()
			.then(() => {
				return knex.migrate.latest()
			})
			.then(() => {
				return knex.seed.run()
			})
			.then(() => {
				done();
			});
	});

	afterEach((done) => {
		knex.migrate.rollback()
			.then(() => {
				done();
			});
	});

	describe('POST', () => {
		it('should save a user to the database', (done) => {
			chai.request(server)
				.post('/api/users/create')
				.send({
					email :'ron.weasley@hogwarts.edu',
					password: 'passwordPASSWORD123',
					passwordConfirmation: 'passwordPASSWORD123',
					userType: 'user'
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					res.body.should.have.property('id');
					res.body.id.should.equal(3);

					res.body.should.have.property('email');
					res.body.email.should.equal('ron.weasley@hogwarts.edu');

					done();
				})
		});
	});

	describe('GET', () => {
		it('should return an error', (done) => {
			chai.request(server)
				.get('/api/users/127512347034')
				.end((err, res) => {
					res.should.not.have.status(200);
					done();
				});
		});

		it('should return a single user', (done) => {
			chai.request(server)
				.get('/api/users/2')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;
					
					res.body.should.have.property('email');
					res.body.email.should.equal('draco.malfoy@hogwarts.edu');

					res.body.should.have.property('id');
					res.body.id.should.equal(2);

					done();
				});
		});
	})

	describe('DELETE', () => {
		it('should fail to delete a user without a JWT', (done) => {
			chai.request(server)
				.delete('/api/users/2')
				.end((err, res) => {
					res.should.have.status(403);
					done();
				}); 
		});
	})
});
