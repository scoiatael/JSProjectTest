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
var message_display;
var execution_form;
var add_connection;
var object_display;

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
      require('./client_wrappers/check_status.js'),
      require('./client_wrappers/server_conn.js')
        ];
  tabber = require('./tabber.js');
  message_display = require('./messageDisplay.js');
  object_display = require('./objectDisplay.js');
  execution_form = require('./executionForm.js');
  add_connection = require('./addConnection.js');
} catch(err) {
  /**
   * sth
   * */
  console.error('(' + err.name + ')' + err.message);
}

var connectionManager = React.createClass({
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
    this.pushToCommands(['$ ' + text, 
                     '-> ' + return_text]); 
   },
  send : function ( text ) {
    var return_text = this.state.connection.send(this.activePeer(),text);
    newM = '-> ' + text;
    this.newMessage(newM);
    this.state.connection.add_message(this.activePeer(), newM);
  },
  addConnection : function(id) {
    this.state.connection.connect(id);
    this.pushToErrors('connecting to ' + id.toString());
  },
  handleData : function (id, text) {
    if(Message.is_message(text)) {
      newM = (id.toString() + ' : ' + Message.get_message(text));
      this.newMessage(newM);
      this.state.connection.add_message(id, newM);
    }
  },
  pushToErrors : function (text) {
    var nerrors = this.state.errors;
    nerrors.push(text);
    if(this.isMounted()) { 
      this.setState({ errors : nerrors  });
    }
  },
  pushToCommands : function (text) {
    var nerrors = this.state.commands;
    nerrors.push(text);
    if(this.isMounted()) { 
      this.setState({ commands : nerrors  });
    }
  },
  handleError : function (err) {
    this.pushToErrors('(' + err.name + ') ' + err.message);
  },
  activePeer : function(i) {
    return this.state.connection.get_list()[i || this.state.clicked];
  },
  handleClick : function (i, tab) {
    var peer = /.*\( (.*) \)/.exec(tab)[1];
    this.setState({clicked : i, messages : this.state.connection.get_history(peer) || []});
    console.log('Active is ' + peer);
  },
  generateTabs : function() {
    return _.map(this.state.connection.get_list(), function(key) {
      var v = this.state.connection.get_metadata(key);
      return (v.name || "") + "( " + key + " )";
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
  createOptions : function () {
    var r = {};
    var ignored = this.state.connection.get_list().concat(this.state.connection.get_id());
    console.log(ignored);
    _.map(this.state.connection.get_peers(), function (v,k) { 
      if(_.indexOf(ignored, k) === -1) {
        r[(v.name || "") + "( " + k + " )"] = _.bind(function () { this.addConnection(k);}, this); 
      }
    }, this);
    console.log(r);
    var addName = { "change name": _.bind(function () {
      var newName = window.prompt("Enter new name:", this.getName());
      if(! _.isNull(newName) ) {
           this.state.connection.set_metadata(
               _.extend(this.state.connection.my_metadata(), { name : newName })
               );
      }
    }, this)};
    return _.extend(addName, r);
  },
  render : function () {
    return (
      <div id = 'main'>
        <div><h2>{this.getName()}</h2>
        </div>
        <div id = 'top'>
          <tabber active={this.state.clicked} onClick={this.handleClick} items={this.generateTabs()} /> 
          <add_connection execute ={this.addConnection} /> 
        </div>
        <div id='main-box'>
          <div id='message-box'>
            <message_display messages={this.state.messages} name='messages'/> 
            <execution_form execute ={this.send} getSuggestions={this.state.connection.complete} /> 
          </div>
          <object_display object={this.createOptions()} name='peers' />
        </div>
        <div id='debug-box'>
          <div id='command-box'>
            <message_display messages={this.state.commands} name='commands'/> 
            <execution_form execute ={this.execute} getSuggestions={this.state.connection.complete} /> 
          </div>
          <message_display messages={this.state.errors} name='errors' /> 
        </div>
      </div>
      );
  },
  getInitialState : function () {
    return { 
      messages : [],
      errors : [],
      clicked : 0,
      commands : []
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
          on_close : _.bind(function(id) { this.pushToErrors(id + ' left'); }, this),
          on_peer_update : _.bind(function() { console.log('peer_update'); this.forceUpdate(); }, this)
        }),
        extension_list: extensions
      })
    });
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
  function cleanup() {
    React.unmountComponentAtNode(document.getElementById('js-content'));
  };
  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('onbeforereload', cleanup);
  window.onbeforeunload = cleanup;
  React.renderComponent(< connectionManager event={cleanup}/>, document.getElementById('js-content'));
  //React.renderComponent(< helloX name='World'/>, document.getElementById('js-content'));
};
