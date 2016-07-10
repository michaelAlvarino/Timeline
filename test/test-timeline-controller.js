/* globals process, require, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const chai		= require('chai');
const chaiHttp	= require('chai-http');
const server	= require('../server/server');
const should	= chai.should();
//const Timeline 	= require('../server/models/Timeline'); unused
const knex		= server.knex;

chai.use(chaiHttp);

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
				.send({
					name: 'Hogwarts'
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					//res.body.should.have.property('id');
					//res.body.id.should.equal(3);

					res.body.should.have.property('name');
					res.body.name.should.equal('Hogwarts');

					done();
				})
		});
	});

	describe('GET', () => {
		it('should return an error', (done) => {
			chai.request(server)
				.get('/api/timeline/127512347034')
				.end((err, res) => {
					res.should.not.have.status(200);
					done();
				});
		});

		it('should return a single timeline', (done) => {
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
