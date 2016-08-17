const $ = require('jquery')
const React = require('react')
const ReactDOM = require('react-dom')

module.exports = function () {
  let HelloMessage = React.createClass({
    propTypes: {
      name: React.propTypes.string
    },

    render: function () {
      return <div>Hello {this.props.name}</div>
    }
  })

  ReactDOM.render(<HelloMessage name="John" />, $('#container')[0])
}
