const $ = require('jquery')
const React = require('react')
const ReactDOM = require('react-dom')

module.exports = function (domElem) {
  let Chat = React.createClass({
    render: function () {
      return (
        <div className="row panel panel-default chat-app row-eq-height">
          <ChannelList />
          <ChatArea url="/api/messages" pollInterval={3000} />
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
      url: React.PropTypes.string,
      pollInterval: React.PropTypes.number
    },

    loadMessagesFromServer: function () {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({data})
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString())
        }.bind(this)
      })
    },

    getInitialState: function () {
      return { data: [] }
    },

    componentDidMount: function () {
      this.loadMessagesFromServer()
      setInterval(this.loadMessagesFromServer, this.props.pollInterval)
    },

    handleSubmit: function (message) {
      console.log(message)
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

    render: function () {
      var messages = this.props.data.map(function (message) {
        return (
          <Message key={message.id} name={message.name} text={message.text} />
        )
      })

      return (
        <div>
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
      if (e.keyCode === 13) {
        this.props.onMessageSubmit(e.target.value)
      }
    },

    render: function () {
      return (
        <div className="chat-input">
          <input type="text" className="chat-input-box"
            id="inputMessage"
            placeholder="Say something!"
            onKeyDown={this.handleKeyDown} />
        </div>
      )
    }
  })

  ReactDOM.render(<Chat />, domElem)
}
