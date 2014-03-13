/** @jsx React.DOM */
var makeClientConnection;
var opts = {};
var React;
var _;

try {
  _ = require('underscore');
  React = require('react');
  makeClientConnection = require('./clientWrapper.js');
} catch(err) {
  /**
   * sth
   * */
}

var messages = React.createClass({
  render : function () {
    return (
      <div id='messages'>
      { 
        _.map(this.props.messages, function(val) {
          return (<div className='message'>{val}</div>);
        })
      }
      </div>)
  }
});

var execute = React.createClass({
  handleSubmit : function() {
    var txt = this.ref.text.getDOMNode().value.trim();
    if(!txt) {
      return false;
    }
    this.props.execute(txt);
    this.ref.text.getDOMNode().value = '';
    return false;
  },
  render : function () {
    return (
      <form id='execute' onSubmit={this.handleSubmit}>
      <input type='text' placeholder='command..' ref='text'/>
      <input type='OK' value='Post'/>
      </form>);
  }
});

var main = React.createClass({
  execute : function () {
   },
  render : function () {
    return (
      <div id = 'main'>
        <div> <h2>Messages</h2></div>
        <messages messages={this.state.messages} />
        <execute execute ={this.execute} />
      </div>
      );
  },
  getInitialState : function () {
    return { messages : []};
  },
  componentDidMount : function () {
    console.log('connecting to client..');
//    this.setState({ connection : makeClientConnection(opts) });
  }
});

var node = document.getElementById('content');
module.exports = function () { 
  React.renderComponent(< main />, node); }
