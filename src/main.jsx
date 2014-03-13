/** @jsx React.DOM */
/**
 * main.jsx
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 13-03-2014
 * */
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
  console.error(err);
}

var messageDisplay = React.createClass({
  render : function () {
    return (
      <div id={this.props.name}>
      { 
        _.map(this.props.messages, function(val, k) {
          return (<div className='message' key={k}>{val}</div>);
        })
      }
      </div>)
  },
  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight
    }
  }
});

var executionForm = React.createClass({
  handleSubmit : function() {
    var txt = this.refs.text.getDOMNode().value.trim();
    if(!txt) {
      return false;
    }
    this.props.execute(txt);
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render : function () {
    return (
      <form id='execute-form' onSubmit={this.handleSubmit} >
      <input type='submit' value='Post' id='post-button'/>
      <input type='text' placeholder='command..' ref='text' id='post-text'/>
      </form>);
  }
});

var connectionManager = React.createClass({
  newMessage : function (text) {
    var newMessages = _.last(this.state.messages,50);
    newMessages.push(text);
    this.setState({ messages : newMessages});
  },
  execute : function (text) {
    var return_text = this.state.connection.execute(text);
    this.newMessage(': ' + text + '->' + return_text); 
   },
  handleData : function (id, text) {
    this.newMessage(id + ' : ' + text);
  },
  handleError : function (err) {
    var nerrors = this.state.errors;
    nerrors.push('(' + err.name + ') ' + err.message)
    this.setState({ errors : nerrors  });
  },
  render : function () {
    return (
      <div id = 'main'>
        <div><h2>Messages</h2></div>
        <div>
          <div id='message-box'>
            <messageDisplay messages={this.state.messages} name='messages'/>
            <executionForm execute ={this.execute} />
          </div>
          <messageDisplay messages={this.state.errors} name='errors' />
        </div>
      </div>
      );
  },
  getInitialState : function () {
    return { 
      messages : new Array(),
      errors : new Array()
    };
  },
  componentWillMount : function () {
    this.setState({ 
      connection : makeClientConnection(_.extend(opts, {
        error_handler : this.handleError,
        on_data : this.handleData,
        on_connection : _.bind(function(id) { this.newMessage('New connection from ' + id); }, this),
        on_close : _.bind(function(id) { this.newMessage(id + ' left'); }, this)
    })) });
  },
  componentWillUnmount : function () {
    this.state.connection.execute('destroy');
  }

});

var helloX = React.createClass({
  render : function() {
    return (
      <div id='hello-x'>
      <h2>Hello {this.props.name}!</h2>
      </div>);
  }
});


module.exports = function () { 
  React.renderComponent(< connectionManager />, document.getElementById('js-content'));
  //React.renderComponent(< helloX name='World' />, document.getElementById('js-content'));
};
