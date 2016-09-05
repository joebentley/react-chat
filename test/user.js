/* globals describe it before */

const chai = require('chai')
const User = require('../models/user')

const should = chai.should()

describe('User', function () {
  const redisClient = require('redis').createClient()
  const userModel = User(redisClient)
  const testUser = { username: 'Joe', channel: '#general' }

  before(function () {
    redisClient.flushdb()
    userModel.updateUser(testUser)
  })

  describe('#attachSocket', function () {
    it('should call socket.join() with user.channel', function (done) {
      let called = false

      userModel.attachSocket('Joe', { join: function (channel) {
        called = true
      }}, function (err) {
        should.not.exist(err)
        called.should.be.true
        done()
      })
    })
  })

  describe('#getUser', function () {
    it('should get test user when added', function (done) {
      userModel.getUser('Joe', function (err, user) {
        should.not.exist(err)
        user.should.deep.equal(testUser)
        done()
      })
    })

    it('should give null if user does not exist', function (done) {
      userModel.getUser('JOE', function (err, user) {
        should.not.exist(err)
        should.not.exist(user)
        done()
      })
    })
  })

  describe('#getUsers', function () {
  })

  describe('#updateUser', function () {
    it('should add new user and update existing user', function (done) {
      redisClient.flushdb()
      let testUser2 = { username: 'Marie', channel: '#random' }

      userModel.updateUser(testUser2, function (err, response) {
        should.not.exist(err)
        response.should.equal(1) // user should not already exist

        // Get user back from redis
        userModel.getUser('Marie', function (err, user) {
          should.not.exist(err)
          user.should.deep.equal(testUser2)

          // Now change user and update
          testUser2.channel = '#general'
          userModel.updateUser(testUser2, function (err, response) {
            should.not.exist(err)
            response.should.equal(0) // user should already exist

            userModel.getUser('Marie', function (err, user) {
              should.not.exist(err)
              user.should.deep.equal(testUser2)
              done()
            })
          })
        })
      })
    })
  })
})
