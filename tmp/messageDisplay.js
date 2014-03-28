/** @jsx React.DOM */
/**
 * messageDisplay.jsx
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 27-03-2014
 * */

var _;
var React;

try {
  _ = require('underscore');
  React = require('react');
} catch(err) {
  /**
   * sth
   * */
  console.error('(' + err.name + ')' + err.message);
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

module.exports = messageDisplay;
