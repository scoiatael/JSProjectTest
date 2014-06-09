/** @jsx React.DOM */
/**
 * objectDisplay.jsx
 * , ii.uni.wroc.pl
 * 02-06-2014
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

var messageDisplay = React.createClass({
  render : function () {
    return (
      <div id={this.props.name}>
      { 
        _.map(this.props.object, function(val, k) {
          console.log(k);
          return (<button className='oD-button' key={k} onClick={val}>{k}</button>);
        })
      }
      </div>)
  },
});

module.exports = messageDisplay;
