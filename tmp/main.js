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
var Message;
var extend_client;
var extensions = [];
var tabber;
var messageDisplay;
var executionForm;

try {
  _ = require('underscore');
  React = require('react');
  extend_client = require('./clientWrapper.js');
  Message = require('./message.js');
  extensions = [
      require('./client_wrappers/autocomplete.js'), 
      require('./client_wrappers/metadata.js'), 
      require('./client_wrappers/execute.js'), 
      require('./client_wrappers/history.js'),
      require('./client_wrappers/server_conn.js')
        ];
  tabber = require('./tabber.js');
  messageDisplay = require('./messageDisplay.js');
  executionForm = require('./executionForm.js');
} catch(err) {
  /**
   * sth
   * */
  console.error('(' + err.name + ')' + err.message);
}

var connectionManager = React.createClass({displayName: 'connectionManager',
  newMessage : function (text) {
    var newMessages = _.last(this.state.messages,50);
    if(typeof text === 'string') {
      newMessages.push(text);
    } else {
      newMessages = newMessages.concat(text);
    }
    if(this.isMounted()) {
      this.setState({ messages : newMessages});
    }
  },
  execute : function (text) {
    var return_text = this.state.connection.execute(text);
    this.newMessage(['$ ' + text, 
                     '-> ' + return_text]); 
   },
  handleData : function (id, text) {
    if(Message.is_message(text)) {
      this.newMessage(id.toString() + ' : ' + Message.get_message(text));
    }
  },
  pushToErrors : function (text) {
    var nerrors = this.state.errors;
    nerrors.push(text);
    if(this.isMounted()) { 
      this.setState({ errors : nerrors  });
    }
  },
  handleError : function (err) {
    this.pushToErrors('(' + err.name + ') ' + err.message);
  },
  activePeer : function(i) {
    return this.state.connection.get_list()[i];
  },
  handleClick : function (i) {
    this.state.clicked = i;
    var peer = this.activePeer();
    this.state.messages = this.state.connection.get_history(peer) || [];
  },
  generateTabs : function() {
    return _.map(this.state.connection.get_list(), function(key) {
      return (this.state.connection.get_metadata(key) || { name : key }).name || key;
    }, this );
  },
  getName : function () {
    var r = this.state.connection.my_metadata();
    if(_.has(r, 'name')) {
      r = r.name + ' ( ' + this.state.connection.get_id() + ' )';
    } else {
      r = this.state.connection.get_id();
    }
    return r;
  },
  render : function () {
    return (
      React.DOM.div( {id:  "main"}, 
        React.DOM.div(null, React.DOM.h2(null, this.getName())
        ),
          tabber( {active:this.state.clicked, onClick:this.handleClick, items:this.generateTabs()} ), 
        React.DOM.div(null, 
          React.DOM.div( {id:"message-box"}, 
            messageDisplay( {messages:this.state.messages, name:"messages"}), 
            executionForm( {execute: this.execute, getSuggestions:this.state.connection.complete} ) 
          ),
            messageDisplay( {messages:this.state.errors, name:"errors"} ) 
        )
      )
      );
  },
  getInitialState : function () {
    return { 
      messages : [],
      errors : [],
      clicked : 0
    };
  },
  componentWillMount : function () {
    this.setState({ 
      connection : extend_client({
        base_opts: _.extend(opts, {
          error_handler : this.handleError,
          on_data : this.handleData,
          on_connection : _.bind(function(id) { this.pushToErrors('New connection from ' + id); }, this),
          on_open : _.bind(function(id) { this.pushToErrors('Chat with ' + id + ' opened'); }, this),
          on_create : _.bind(function(id) { this.pushToErrors('Connection opened'); }, this),
          on_close : _.bind(function(id) { this.pushToErrors(id + ' left'); }, this)
        }),
        extension_list: extensions
      })
    });
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
  function cleanup() {
    React.unmountComponentAtNode(document.getElementById('js-content'));
    return "are you sure?";
  };
  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('beforereload', cleanup);
  React.renderComponent(connectionManager( {event:cleanup}), document.getElementById('js-content'));
  //React.renderComponent(< helloX name='World'/>, document.getElementById('js-content'));
};
