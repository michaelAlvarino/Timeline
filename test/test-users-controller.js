const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../server/server');
const should    = chai.should();
const User      = require('../server/models/User');

chai.use(chaiHttp);

describe('UsersController', () => {
    describe('GET', () => {
        it('should return a single user', (done) => {
            chai.request(server)
                .get('/api/users/3')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return a 404', (done) => {
            chai.request(server)
                .get('/api/users/1275123470')
                .end((err, res) => {
                    res.body.should.equal('User not found');
                    res.should.have.status(404);
                    done();
                });
        });
    })
});
