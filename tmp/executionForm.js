/** @jsx React.DOM */
/**
 * executionForm.jsx
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

var executionForm = (function () {
  function handleSubmit () {
    var txt = this.refs.text.getDOMNode().value.trim();
    if(!txt) {
      return false;
    }
    this.props.execute(txt);
    this.refs.text.getDOMNode().value = '';
    return false;
  }
  return React.createClass({
    onKeyUp : _.debounce(function () {
      var txt = _.last(this.refs.text.getDOMNode().value.trim().split(' '));
      var sugg;
      sugg = this.props.getSuggestions(txt);
      if( _.size(sugg) === 1) {
        this.refs.text.getDOMNode().value = sugg;
      }
    }, 100),
    render : function () {
      return (
        React.DOM.form( {id:"execute-form", onSubmit:handleSubmit.bind(this)} , 
        React.DOM.input( {type:"submit", value:"Post", id:"post-button"}),
        React.DOM.input( {type:"text", placeholder:"command..", ref:"text", id:"post-text"})
        ));
    }
  });
}());

module.exports = executionForm;
