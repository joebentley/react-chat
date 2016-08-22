const $ = require('jquery')
const React = require('react')
const ReactDOM = require('react-dom')
const socket = require('socket.io-client')()

module.exports = function (domElem) {
  let Chat = React.createClass({
    render: function () {
      return (
        <div className="row panel panel-default chat-app row-eq-height">
          <ChannelList />
          <ChatArea pollInterval={3000} />
        </div>
      )
    }
  })

  let ChannelList = React.createClass({
    render: function () {
      return (
        <div className="col-xs-3 panel-body channel-list">
          Hello
        </div>
      )
    }
  })

  let ChatArea = React.createClass({
    propTypes: {
      pollInterval: React.PropTypes.number
    },

    getInitialState: function () {
      return { username: '', data: [] }
    },

    componentDidMount: function () {
      socket.on('username', (username) => {
        this.setState({username})
      })

      socket.on('messages', (data) => {
        this.setState({ data: data.map(JSON.parse) })
      })

      socket.on('connect', function () {
        socket.emit('getUsername')
        socket.emit('getMessages')
      })
    },

    handleSubmit: function (message) {
      // Optimistically post the message immediately
      this.state.data.push({
        id: this.state.data.length,
        name: this.state.username,
        text: message
      })
      this.forceUpdate()

      // Send to server
      socket.emit('newMessage', message)
    },

    render: function () {
      return (
        <div className="col-xs-9 panel-body">
          <MessageList data={this.state.data} />
          <div className="row bottom chat-input-container">
            <InputBox onMessageSubmit={this.handleSubmit}/>
          </div>
        </div>
      )
    }
  })

  let MessageList = React.createClass({
    propTypes: {
      data: React.PropTypes.array
    },

    componentDidUpdate: function () {
      // Scroll to bottom of messages
      $('#messageList').scrollTop($('#messageList')[0].scrollHeight)
    },

    render: function () {
      var messages = this.props.data.map(function (message) {
        return (
          <Message key={message.id} name={message.name} text={message.text} />
        )
      })

      return (
        <div id="messageList" className="chat-message-list">
          {messages}
        </div>
      )
    }
  })

  let Message = React.createClass({
    propTypes: {
      name: React.PropTypes.string,
      text: React.PropTypes.string
    },

    render: function () {
      return (
        <div className="row chat-message">
          <div><strong>{this.props.name}</strong></div>
          <div>{this.props.text}</div>
        </div>
      )
    }
  })

  let InputBox = React.createClass({
    propTypes: {
      onMessageSubmit: React.PropTypes.func
    },

    handleKeyDown: function (e) {
      if (e.keyCode === 13 && e.target.value.trim() !== '') {
        this.props.onMessageSubmit(e.target.value.trim())
        e.target.value = ''
      }
    },

    render: function () {
      return (
        <div className="chat-input">
          <input type="text" className="chat-input-box"
            id="inputMessage"
            placeholder="Say something!"
            onKeyDown={this.handleKeyDown}></input>
        </div>
      )
    }
  })

  ReactDOM.render(<Chat />, domElem)
}
