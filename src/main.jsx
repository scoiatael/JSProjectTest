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
}

var messageDisplay = React.createClass({
  render : function () {
    return (
      <div id='messages'>
      { 
        _.map(this.props.messages, function(val, k) {
          return (<div className='message' key={k}>{val}</div>);
        })
      }
      </div>)
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
      <form id='execute-form' onSubmit={this.handleSubmit}>
      <input type='submit' value='Post'/>
      <input type='text' placeholder='command..' ref='text'/>
      </form>);
  }
});

var connectionManager = React.createClass({
  execute : function (text) {
    this.setState({ messages : [text]});
   },
  render : function () {
    return (
      <div id = 'main'>
        <div><h2>Messages</h2></div>
        <messageDisplay messages={this.state.messages} />
        <executionForm execute ={this.execute} />
      </div>
      );
  },
  getInitialState : function () {
    return { messages : []};
  },
  componentWillMount : function () {
//    this.setState({ connection : makeClientConnection(opts) });
  },
  componentWillUnmount : function () {
    if(typeof this.state.connection !== 'undefined') {
      this.state.connection.execute('destroy');
    }
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
