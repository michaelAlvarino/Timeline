/* globals process, require, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const RouteTrie     = require('../server/helpers/RouteTrie');
const chai          = require('chai');
const should        = chai.should();

describe('User', () => {
    describe('#insert', () => {
        it('should store a route', () => {
            var trie    = new RouteTrie(),
                route   = '/api/users';

            trie.insert(route);
            trie.patterns.should.have.property('/api/users');
        });
    });

    describe('#match', () => {
        it('should return true if a pattern has been stored in the trie', () => {
            var trie    = new RouteTrie(),
                route   = '/never/gonna/give/you/up';

            trie.insert(route);
            trie.match(route).should.equal(true);
        });

        it('should return false if a pattern has not been stored in the trie', () => {
            var trie    = new RouteTrie(),
                route   = '/never/gonna/let/you/down';

            trie.insert(route);
            trie.match('/never/gonna/run/around/and/desert/you').should.equal(false);
        });

        it('should match basic regex', () => {
            var trie    = new RouteTrie(),
                route   = '/api/users/\\d+',
                url     = '/api/users/3';

            trie.insert(route);
            trie.match(url).should.equal(true);
        });

        it('should match regex with params', () => {
            var trie    = new RouteTrie(),
                route   = '/api/users/:id(\\d+)',
                url     = '/api/users/3';

            trie.insert(route);
            trie.match(url).should.equal(true);
        });

        it('should match multiple regex', () => {
            var trie    = new RouteTrie(),
                route   = '/api/users/:id(\\d+)/friends/:friendId(\\d+)',
                url     = '/api/users/3/friends/90';

            trie.insert(route);
            trie.match(url).should.equal(true);
        });
    });
});