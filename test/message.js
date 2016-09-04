/* globals describe it before */

const chai = require('chai')
const Message = require('../models/message')
const User = require('../models/user')

const should = chai.should()

describe('User', function () {
  const redisClient = require('redis').createClient()
  const messageModel = Message(redisClient)
  const userModel = User(redisClient)
  const testUser = { username: 'Joe', channel: '#random' }
  const testUser2 = { username: 'Marie', channel: '#general' }

  before(function (done) {
    redisClient.flushdb()
    userModel.newUser(testUser, function () {
      userModel.newUser(testUser2, done)
    })
  })

  describe('#getMessages', function () {
    it('should get new added messages', function (done) {
      messageModel.newMessage('Joe', 'Hello', function (err, newMessages) {
        if (err) {
          done(err)
        }
        should.not.exist(err)

        messageModel.newMessage('Marie', 'Yoyo', function (err, newMessages) {
          if (err) {
            done(err)
          }
          should.not.exist(err)

          messageModel.getMessages('Joe', function (err, messages) {
            if (err) {
              done(err)
            }
            should.not.exist(err)
            messages[0].message.should.equal('Hello')
            messages.should.have.length(1)
            messageModel.getMessages('Marie', function (err, messages) {
              if (err) {
                done(err)
              }
              should.not.exist(err)
              messages[0].message.should.equal('Yoyo')
              messages.should.have.length(1)
              done()
            })
          })
        })
      })
    })
  })

  describe('#newMessage', function () {
    it('should add message to current channel', function (done) {
      messageModel.newMessage('Joe', 'Hello', function (err, newMessages) {
        if (err) {
          done(err)
        }
        should.not.exist(err)
        newMessages[0].message.should.equal('Hello')
        newMessages[0].channel.should.equal('#random')
        done()
      })
    })
  })
})
