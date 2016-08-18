const $ = require('jquery')
const chat = require('./chat.jsx')

$(function () {
  if ($('#chatContainer').length > 0) {
    chat($('#chatContainer')[0])
  }
})
