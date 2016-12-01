/* globals Notification */

const $ = require('jquery')
const chat = require('./chat.jsx')

$(function () {
  Notification.requestPermission(function () {
    if ($('#chatContainer').length > 0) {
      chat($('#chatContainer')[0])
    }
  })
})
