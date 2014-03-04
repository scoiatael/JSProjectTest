/** @jsx React.DOM */
/*global document*/
"use strict";
var React = require("react");
var mountNode = document.getElementById('hello');
var adder = require("./adder.js")();
var multiplier = require("./multiplier.js")();
var coffeeAdder = require("./coffeeAdder.js")();

var helloMessage = React.createClass({displayName: 'helloMessage',
  render: function() {
    var x = 2;
    var y = 6;
    return React.DOM.div(null, "Hello ", this.props.name,React.DOM.br(null), 
      x, " + ", y, " is ", adder.add(x,y), " ", React.DOM.br(null), 
      x, " * ", y, " is ", multiplier.mult(x,y),React.DOM.br(null),
      x, " - ", x, " is ", coffeeAdder.minus(x,y));
  }
});

module.exports = { 'render' : function() { React.renderComponent(helloMessage( {name:"John"} ), mountNode); } };
