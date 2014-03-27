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

try {
  _ = require('underscore');
  React = require('react');
  extend_client = require('./clientWrapper.js');
  Message = require('./message.js');
  extensions = _.map(['metadata', 'autocomplete', 'execute', 'history'],
      function(name) {
        return require('./client_wrappers/' + name + '.js');
      });
} catch(err) {
  /**
   * sth
   * */
  console.error('(' + err.name + ')' + err.message);
}

var tabber = React.createClass({
  handleClick: function(i) {
    console.log('clicked ' + this.props.items[i]);
    this.props.handleClick(i);
  },
  buttonActive : function(c,i) {
    var ret = '0';
    if(c === i) {
     ret = '1';
    } 
    return ret;
  },
  render: function() {
    return (
      <div id='tabber-div'>
        {
          this.props.items.map(function(item, i) {
            return (
              <button className='tabber-tab'
                      data-active={this.buttonActive(this.state.clicked, i)}
                      onClick={this.handleClick.bind(this, i)} key={i}>
              {item}
              </button>
              );
          }, this) 
        }
      </div>
      );
  }
});


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
  onKeyUp : _.debounce(function () {
    var txt = _.last(this.refs.text.getDOMNode().value.trim().split(' '));
    var sugg;
    sugg = this.props.getSuggestions(txt);
    if( _.size(sugg) === 1) {
      this.refs.text.getDOMNode().value = sugg;
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
    if(this.isMounted()) {
      this.setState({ messages : newMessages});
    }
  },
  execute : function (text) {
    var return_text = this.state.connection.execute(text);
    this.newMessage('You: ' + return_text); 
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
    pushToErrors('(' + err.name + ') ' + err.message);
  },
  activePeer : function() {
    return this.state.connection.get_list()[i];
  },
  handleClick : function (i) {
    this.state.clicked = i;
    var peer = this.activePeer();
    this.state.messages = this.state.connection.get_history(peer) || [];
  },
  generateTabs : function() {
    return _.map(function(key) {
      return (this.state.connection.get_meta(key) || { name : key }).name || key;
    }, this.state.connection.get_list());
  },
  render : function () {
    return (
      <div id = 'main'>
        <div><h2>{this.state.connection.get_id()}</h2>
        </div>
        <tabber onClick={this.handleClick} items={this.generateTabs()} />
        <div>
          <div id='message-box'>
            <messageDisplay messages={this.state.messages} name='messages'/>
            <executionForm execute ={this.execute} getSuggestions={this.state.connection.complete} />
          </div>
          <messageDisplay messages={this.state.errors} name='errors' />
        </div>
      </div>
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
    return "are you sure?";
  };
  window.addEventListener('beforeunload', cleanup);
  React.renderComponent(< connectionManager event={cleanup}/>, document.getElementById('js-content'));
};
