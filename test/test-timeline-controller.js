/* globals process, require, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const chai			= require('chai');
const chaiHttp		= require('chai-http');
const server		= require('../server/server');
const AuthHelper 	= require('../server/helpers/AuthHelper.js');
const should		= chai.should();
const knex			= server.knex;

chai.use(chaiHttp);

const validToken = AuthHelper.generateJWT({
	userType: 'admin',
	id: 1
});

describe('TimelineController', () => {
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
		it('should save a timeline to the database', (done) => {
			var dt = new Date().toISOString();
			chai.request(server)
				.post('/api/timelines/create')
				.set('timelineToken', validToken)
				.send({
					name: 'Beauxbatons'
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					res.body.should.have.property('id');
					res.body.id.should.equal(3);

					res.body.should.have.property('name');
					res.body.name.should.equal('Beauxbatons');

					done();
				})
		});
		it('should not save a timeline if the token is not submitted', (done) => {
			var dt = new Date().toISOString(),
			invalidToken = null;
			chai.request(server)
				.post('/api/timelines/create')
				.set('timelineToken', invalidToken)
				.send({
					name: 'Beauxbatons'
				})
				.end((err, res) => {
					res.should.have.status(403);
					res.should.be.json;

					res.body.should.have.property('errors');
					res.body.errors[0].should.equal('Invalid credentials');

					done();
				})
		});
	});

	describe('GET', () => {
		it('should return an error', (done) => {
			chai.request(server)
				// getting a postgres error here when I use
				// the same number as in test-user-controller
				// instead use the max signed 32 bit integer
				.get('/api/timelines/2147483647')
				.end((err, res) => {
					res.should.not.have.status(200);
					res.should.have.status(404);
					res.body.should.have.property('errors');
					res.body.errors[0].should.equal('timeline not found');
					done();
				});
		});

		it('should return a single timeline', (done) => {
			chai.request(server)
				.get('/api/timelines/2')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					res.body.should.have.property('success');
					res.body.success.should.equal(true);
					
					res.body.data.should.have.property('name');
					res.body.data.name.should.equal('Hogwarts School of Witchcraft and Wizardry');

					res.body.data.should.have.property('id');
					res.body.data.id.should.equal(2);

					done();
				});
		});
	})

	describe('DELETE', () => {
		it('should fail to delete a timeline without a JWT', (done) => {
			chai.request(server)
				.delete('/api/timelines/1')
				.end((err, res) => {
					res.should.have.status(403);
					done();
				}); 
		});
	})
});
