/** @jsx React.DOM */
/**
 * tabber.jsx
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

var tabber = (function () { 
  function handleClick (i) {
    console.log('clicked ' + this.props.items[i]);
    this.props.onClick(i, this.props.items[i]);
  }
  function isButtonActive (i) {
    var ret = '0';
    if(this.props.active === i) {
     ret = '1';
    } 
    return ret;
  }
  function createButton(item, i) {
    return (
      <button className='tabber-tab'
              data-active={isButtonActive.call(this, i)}
              onClick={handleClick.bind(this, i)} key={i}>
      {item}
      </button>
      );
  }
  return React.createClass({
    render: function() {
      return (
        <div id='tabber-div'>
          { _.map(this.props.items, createButton, this) }
        </div>
        );
    }});
}());

module.exports = tabber;
