/** @jsx React.DOM */
/**
 * addConnection.jsx
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 29-03-2014
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
    render : function () {
      return (
        <form id='execute-form' onSubmit={handleSubmit.bind(this)} >
        <button type='submit' id='addC-button' >
          <img src='img/tab-new.png' alt='connect' id='addC-img' /> </ button>
        <input type='text' placeholder='id..' ref='text' id='addC-text'/>
        </form>);
    }
  });
}());

module.exports = executionForm;
