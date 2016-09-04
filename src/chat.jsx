const $ = require('jquery')
const React = require('react')
const ReactDOM = require('react-dom')
const socket = require('socket.io-client')()

module.exports = function (domElem) {
  let Chat = React.createClass({
    getInitialState: function () {
      return { username: '', data: [] }
    },

    componentDidMount: function () {
      socket.on('user', (user) => {
        this.setState({ user })
      })

      socket.on('messages', (data) => {
        this.setState({ data })
      })

      socket.on('connect', function () {
        socket.emit('getUser')
        socket.emit('getMessages')
      })
    },

    handleSubmit: function (message) {
      // Optimistically post the message immediately
      this.state.data.push({
        name: this.state.user.username,
        message: message
      })
      this.forceUpdate()

      // Send to server
      socket.emit('newMessage', message)
    },

    handleChannelSwitch: function (newChannel) {
      socket.emit('getUser')
      socket.emit('getMessages')
    },

    render: function () {
      return (
        <div className="row panel panel-default chat-app row-eq-height">
          <ChannelList onChannelSwitch={this.handleChannelSwitch} />
          <div className="col-xs-9 panel-body">
            <MessageList data={this.state.data} />
            <div className="row bottom chat-input-container">
              <InputBox onMessageSubmit={this.handleSubmit}/>
            </div>
          </div>
        </div>
      )
    }
  })

  let ChannelList = React.createClass({
    propTypes: {
      onChannelSwitch: React.PropTypes.func,
      initialChannel: React.PropTypes.string
    },

    channelSwitchHandler: function (newChannel) {
      socket.emit('switchChannel', newChannel)

      this.props.onChannelSwitch(newChannel)
    },

    constructOnClickHandler: function () {
      return (e) => {
        $('.channel').removeClass('channel-clicked')
        $(e.target).addClass('channel-clicked')

        this.channelSwitchHandler(e.target.text)
      }
    },

    getInitialState: function () {
      return { channels: [] }
    },

    componentDidMount: function () {
      socket.emit('getChannels')

      socket.on('channels', (channels) => {
        this.setState({channels})
      })
    },

    render: function () {
      let channels = this.state.channels.map((channel, i) => {
        return (
          <span key={i}>
            <a className="channel" onClick={this.constructOnClickHandler()}
               href={channel}>{channel}</a><br />
          </span>
        )
      })

      return (
        <div className="col-xs-3 panel-body channel-list">
          {channels}
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
      let messages = this.props.data.map(function (message, i) {
        return (
          <Message key={i} name={message.name} text={message.message} />
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
