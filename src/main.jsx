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
  exec_ext = require('./client_wrappers/execute.js');
  extend_client = require('./clientWrapper.js');
} catch(err) {
  /**
   * sth
   * */
  console.error('(' + err.name + ')' + err.message);
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
  handleKeyUp : _.debounce(function () {
    var txt = this.refs.text.getDOMNode().value.trim().split(' ');
    var sugg;
    var matcher = function (i) {
      console.log('suggestion ' + i + '?');
      if(i.indexOf(_.head(txt)) === 0) {
        sugg = i;
        return true;
      }
      console.log('not');
      return false;
    };
    if(_.size(txt) === 1) {
      if(_.chain(this.props.suggestions).filter(matcher).size().value() === 1) {
        this.refs.text.getDOMNode().value = sugg;
      }
    }
  }, 100),
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
    this.newMessage(': ' + return_text); 
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
            <executionForm execute ={this.execute} suggestions={this.state.connection.accepted_values} />
          </div>
          <messageDisplay messages={this.state.errors} name='errors' />
        </div>
      </div>
      );
  },
  getInitialState : function () {
    return { 
      messages : [],
      errors : []
    };
  },
  componentWillMount : function () {
    this.setState({ 
      connection : extend_client({
        base_opts: _.extend(opts, {
          error_handler : this.handleError,
          on_data : this.handleData,
          on_connection : _.bind(function(id) { this.newMessage('New connection from ' + id); }, this),
          on_open : _.bind(function(id) { this.newMessage('Chat with ' + id + ' opened'); }, this),
          on_create : _.bind(function(id) { this.newMessage('Connection opened'); }, this),
          on_close : _.bind(function(id) { this.newMessage(id + ' left'); }, this)
        }),
        extension_list: [exec_ext]
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
  React.renderComponent(< connectionManager />, document.getElementById('js-content'));
  //React.renderComponent(< helloX name='World' />, document.getElementById('js-content'));
};
