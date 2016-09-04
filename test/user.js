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
    userModel.newUser(testUser)
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
    it('test user should be added', function (done) {
      userModel.getUser('Joe', function (err, user) {
        if (err) {
          done(err)
        }

        should.not.exist(err)
        user.should.deep.equal(testUser)
        done()
      })
    })
  })

  describe('#newUser', function () {
    it('new user should be added properly', function (done) {
      let testUser2 = { username: 'Marie', channel: '#random' }

      userModel.newUser(testUser2, function (err, response) {
        if (err) {
          done(err)
        }
        should.not.exist(err)
        response.should.equal(1) // field should not already exist

        userModel.getUser('Marie', function (err, user) {
          if (err) {
            done(err)
          }
          should.not.exist(err)
          user.should.deep.equal(testUser2)

          testUser2.channel = '#general'
          userModel.newUser(testUser2, function (err, response) {
            if (err) {
              done(err)
            }
            should.not.exist(err)
            response.should.equal(0) // field should already exist
            done()
          })
        })
      })
    })
  })
})
