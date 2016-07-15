/* globals process, require, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const chai			= require('chai');
const chaiHttp		= require('chai-http');
const server		= require('../server/server');
const should		= chai.should();
//const Timeline 	= require('../server/models/Timeline'); unused
const knex			= server.knex;
const AuthHelper	= require('./../server/helpers/AuthHelper');

chai.use(chaiHttp);

const validToken = AuthHelper.generateJWT({ 
	userType: 'admin',
	id: 1
});

describe('TimelineItemController', () => {
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
		it('should save a timeline item to the database', (done) => {
			var dt = new Date().toISOString();
			chai.request(server)
				.post('/api/timelineItem/create')
				.set('timelinetoken', validToken)
				.send({
					timelineId: 1,
					content: 'Salazar Slytherin disagreed with the other Hogwarts founders about the importance of ' + 
						'blood purity and the acceptance of Muggle-borns at Hogwarts School of Witchcraft and ' + 
						'Wizardry, As the other Founders were against him in this matter, he left the school. ' + 
						'According to legend, before he left, he created a secret chamber deep underground in ' + 
						'Hogwarts Castle - known as the Chamber of Secrets.',
					title: 'Creation of The Chamber of Secrets',
					imageUrl: '//a.snek.jpg/',
					userId: 1, // AuthHelper.getUserId(token), change this as we get more familiar with tests
					status: null,
					createdDate: dt,
					updatedDate: dt	
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					res.body.should.have.property('id');
					res.body.id.should.equal(2);

					res.body.should.have.property('content');
					res.body.content.should.equal(
						'Salazar Slytherin disagreed with the other Hogwarts founders about the importance of ' + 
						'blood purity and the acceptance of Muggle-borns at Hogwarts School of Witchcraft and ' + 
						'Wizardry, As the other Founders were against him in this matter, he left the school. ' + 
						'According to legend, before he left, he created a secret chamber deep underground in ' + 
						'Hogwarts Castle - known as the Chamber of Secrets.'
					);
					// res.body.should.have.property('title');
					// res.body.title.should.equal('Creation of The Chamber of Secrets');

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
				.get('/api/timelineItem/2147483647')
				.end((err, res) => {
					console.log(res.body.errors);
					res.should.not.have.status(200);
					res.should.have.status(404);
					res.body.should.have.property('errors');
					res.body.errors[0].should.equal('timeline item not found');
					done();
				});
		});

		it('should return a single timeline item', (done) => {
			chai.request(server)
				.get('/api/timelineItem/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					res.body.should.have.property('success');
					res.body.success.should.equal(true);
					
					res.body.data.should.have.property('title');
//					res.body.data.name.should.equal('');

					res.body.data.should.have.property('id');
					res.body.data.id.should.equal(1);

					done();
				});
		});
	})
/*
	describe('DELETE', () => {
		it('should fail to delete a timeline without a JWT', (done) => {
			chai.request(server)
				.delete('/api/timelines/1')
				.end((err, res) => {
					res.should.have.status(403);
					done();
				}); 
		});
	})*/
});
