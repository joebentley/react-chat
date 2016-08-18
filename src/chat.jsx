const React = require('react')
const ReactDOM = require('react-dom')

module.exports = function (domElem) {
  let Chat = React.createClass({
    render: function () {
      return (
        <div className="row panel panel-default chat-app row-eq-height">
          <ChannelList />
          <ChatArea />
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
    render: function () {
      return (
        <div className="col-xs-9 panel-body">
          <MessageList />
          <div className="row bottom chat-input-container">
            <InputBox />
          </div>
        </div>
      )
    }
  })

  let MessageList = React.createClass({
    render: function () {
      var dummy = [ { id: 1, name: 'joe', text: 'hello marie!' }, { id: 2, name: 'marie', text: 'hey joe' } ]

      var messages = dummy.map(function (message) {
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
    render: function () {
      return (
        <div className="chat-input">
          <input type="text" className="chat-input-box" id="inputMessage" placeholder="Say something!"/>
        </div>
      )
    }
  })

  ReactDOM.render(<Chat />, domElem)
}
