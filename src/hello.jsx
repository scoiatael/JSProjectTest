/** @jsx React.DOM */
/*global document*/
"use strict";
var React = require("react");
var mountNode = document.getElementById('hello');
var adder = require("../src/adder.js")();
var multiplier = require("../src/multiplier.js")();

var helloMessage = React.createClass({
  render: function() {
    var x = 2;
    var y = 6;
    return <div>Hello {this.props.name}<br/> {x} + {y} is {adder.add(x,y)} <br/> {x} * {y} is {multiplier.mult(x,y)}</div>;
  }
});

module.exports = { 'render' : function() { React.renderComponent(<helloMessage name="John" />, mountNode); } };
