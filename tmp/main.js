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

var messageDisplay = React.createClass({displayName: 'messageDisplay',
  render : function () {
    return (
      React.DOM.div( {id:"messages"}, 
       
        _.map(this.props.messages, function(val, k) {
          return (React.DOM.div( {className:"message", key:k}, val));
        })
      
      ))
  }
});

var executionForm = React.createClass({displayName: 'executionForm',
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
      React.DOM.form( {id:"execute-form", onSubmit:this.handleSubmit}, 
      React.DOM.input( {type:"submit", value:"Post"}),
      React.DOM.input( {type:"text", placeholder:"command..", ref:"text"})
      ));
  }
});

var connectionManager = React.createClass({displayName: 'connectionManager',
  execute : function (text) {
    this.setState({ messages : [text]});
   },
  render : function () {
    return (
      React.DOM.div( {id:  "main"}, 
        React.DOM.div(null, React.DOM.h2(null, "Messages")),
        messageDisplay( {messages:this.state.messages} ),
        executionForm( {execute: this.execute} )
      )
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

var helloX = React.createClass({displayName: 'helloX',
  render : function() {
    return (
      React.DOM.div( {id:"hello-x"}, 
      React.DOM.h2(null, "Hello ", this.props.name,"!")
      ));
  }
});


module.exports = function () { 
  React.renderComponent(connectionManager(null ), document.getElementById('js-content'));
  //React.renderComponent(< helloX name='World' />, document.getElementById('js-content'));
};
