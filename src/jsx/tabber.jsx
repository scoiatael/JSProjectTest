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
    this.props.handleClick(i);
  }
  function buttonActive (c,i) {
    var ret = '0';
    if(c === i) {
     ret = '1';
    } 
    return ret;
  }
  function createButton(item, i) {
    return (
      <button className='tabber-tab'
              data-active={buttonActive(this.state.clicked, i)}
              onClick={handleClick.bind(this, i)} key={i}>
      {item}
      </button>
      );
  }
  return React.createClass({
    render: function() {
      return (
        <div id='tabber-div'>
          {this.props.items.map(createButton, this)}
        </div>
        );
    }});
}());

module.exports = tabber;
