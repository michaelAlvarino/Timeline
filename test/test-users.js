/* globals process, require, describe, it */
'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const assert = chai.assert
const User = require('../server/models/User')
const server = require('../server/server');
const knex = server.knex;

const validUser = {
    password: 'passwordPASSWORD1234567890',
    passwordConfirmation: 'passwordPASSWORD1234567890',
    email: 'email@example.com',
    userType: 'user'
}

// TODO: Test the 'private' methods in User.js
describe('User', () => {
    beforeEach(done => {
        knex.migrate.rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run())
            .then(() => done())
    })

    afterEach(done => {
        knex.migrate.rollback().then(() => done())
    })

    describe('#validateUser', () => {
        it('should return an object if valid', () => {
            let user = Object.assign({}, validUser)

            user = User.validateUser(user)

            assert.equal(user.email, 'email@example.com')
            assert.equal(user.userType, 'user')
            assert.typeOf(user.passwordDigest, 'string')
            assert.typeOf(user.createdDate, 'string')
            assert.typeOf(user.updatedDate, 'string')
            assert.typeOf(user.password, 'undefined')
        })

        it('should not be valid if userAttributes are empty', () => {
            let user = User.validateUser({})

            assert.isAbove(user.errors.length, 0)
            assert.typeOf(user.createdDate, 'undefined')
            assert.typeOf(user.updatedDate, 'undefined')
        })

        it('should not be valid if email is invalid', () => {
            let user = Object.assign({}, validUser, { email: 'jafart.com' })
            user = User.validateUser(user)

            assert.isAbove(user.errors.length, 0)
            assert.typeOf(user.createdDate, 'undefined')
            assert.typeOf(user.updatedDate, 'undefined')
        })

        it('should not be valid without a password', () => {
            let user = Object.assign({}, validUser, { password: null })
            user = User.validateUser(user)

            assert.isAbove(user.errors.length, 0)
            assert.typeOf(user.createdDate, 'undefined')
            assert.typeOf(user.updatedDate, 'undefined')
        })

        it('should be valid without a password if not updating password', () => {
            let user = Object.assign({}, validUser, { password: null })
            user = User.validateUser(user, false)

            assert.equal(user.errors.length, 0)
            assert.typeOf(user.createdDate, 'string')
            assert.typeOf(user.updatedDate, 'string')
        })

        it('should ignore invalid user types', () => {
            let jafart = Object.assign({}, validUser, { userType: 'Jafart' })
            jafart = User.validateUser(jafart)

            assert.equal(jafart.userType, 'user')
        })
    })

    describe('#createUser', () => {
        it('should create a new user', () => {
            let user = Object.assign({}, validUser)

            User.createUser(user)
                .then(user => {
                    assert.equal(user.email, validUser.email)
                    assert.typeOf(user.password, 'undefined')
                    assert.typeOf(user.passwordDigest, 'string')
                })
        })

        it('should not allow users to have the same email', () => {
            let harryPotterBoyWhoLift = Object.assign({},
                validUser, { email: 'harry.potter@hogwarts.edu' }
            )

            User.createUser(harryPotterBoyWhoLift)
                .catch(user => {
                    assert.isAbove(user.errors.length, 0)
                    assert.isAbove(user.errors.indexOf('Email already taken'), -1)
                })
        })
    })

    describe('#updateUser', () => {
        it('should update a user\'s email', () => {
            let hpJafart = Object.assign({}, validUser, 
            	{ id: 1, email: 'hpIsTheBusiness@jafart.com' }
            )

            User.updateUser(hpJafart)
            	.then(hpJafart => {
            		assert.equal(hpJafart.email, 'hpIsTheBusiness@jafart.com')
            	})

        })

        it('should not allow users to have the same email', () => {
            let harryPotterBoyWhoLift = Object.assign({},
                validUser, { email: 'harry.potter@hogwarts.edu' }
            )

            User.updateUser(harryPotterBoyWhoLift)
                .catch(user => {
                    assert.isAbove(user.errors.length, 0)
                    assert.isAbove(user.errors.indexOf('Email already taken'), -1)
                })
        })
    })
})
