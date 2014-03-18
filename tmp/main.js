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

var messageDisplay = React.createClass({displayName: 'messageDisplay',
  render : function () {
    return (
      React.DOM.div( {id:this.props.name}, 
       
        _.map(this.props.messages, function(val, k) {
          return (React.DOM.div( {className:"message", key:k}, val));
        })
      
      ))
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
      React.DOM.form( {id:"execute-form", onSubmit:this.handleSubmit} , 
      React.DOM.input( {type:"submit", value:"Post", id:"post-button"}),
      React.DOM.input( {type:"text", placeholder:"command..", ref:"text", id:"post-text"})
      ));
  }
});

var connectionManager = React.createClass({displayName: 'connectionManager',
  newMessage : function (text) {
    var newMessages = _.last(this.state.messages,50);
    newMessages.push(text);
    this.setState({ messages : newMessages});
  },
  execute : function (text) {
    var return_text = this.state.connection.execute(text);
    this.newMessage(': ' + text + ' -> ' + return_text); 
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
      React.DOM.div( {id:  "main"}, 
        React.DOM.div(null, React.DOM.h2(null, "Messages")),
        React.DOM.div(null, 
          React.DOM.div( {id:"message-box"}, 
            messageDisplay( {messages:this.state.messages, name:"messages"}),
            executionForm( {execute: this.execute} )
          ),
          messageDisplay( {messages:this.state.errors, name:"errors"} )
        )
      )
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
