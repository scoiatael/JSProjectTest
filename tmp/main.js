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

var messages = React.createClass({displayName: 'messages',
  render : function () {
    return (
      React.DOM.div( {id:"messages"}, 
       
        _.map(this.props.messages, function(val) {
          return (React.DOM.div( {className:"message"}, val));
        })
      
      ))
  }
});

var execute = React.createClass({displayName: 'execute',
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
      React.DOM.form( {id:"execute", onSubmit:this.handleSubmit}, 
      React.DOM.input( {type:"text", placeholder:"command..", ref:"text"}),
      React.DOM.input( {type:"OK", value:"Post"})
      ));
  }
});

var main = React.createClass({displayName: 'main',
  execute : function () {
   },
  render : function () {
    return (
      React.DOM.div( {id:  "main"}, 
        React.DOM.div(null,  " ", React.DOM.h2(null, "Messages")),
        messages( {messages:this.state.messages} ),
        execute( {execute: this.execute} )
      )
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
  React.renderComponent(React.DOM.main(null ), node); }
