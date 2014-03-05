/** @jsx React.DOM */
/*global document*/
"use strict";
var mountNode = document.getElementById('hello');
var React       ;
var adder       ;
var multiplier  ;
var coffeeAdder ;

try {
  React       = require("react");
  adder       = require("./adder.js")();
  multiplier  = require("./multiplier.js")();
  coffeeAdder = require("./coffeeAdder.js")();
} catch(err) {
  //unable to require/export -> jasmine testing ;)
}

var helloMessage = React.createClass({
  render: function() {
    var x = 2;
    var y = 6;
    return <div>Hello {this.props.name}<br/> 
      {x} + {y} is {adder.add(x,y)} <br/> 
      {x} * {y} is {multiplier.mult(x,y)}<br/>
      {x} - {y} is {coffeeAdder.minus(x,y)}</div>;
  }
});

module.exports = { 'render' : function() { React.renderComponent(<helloMessage name="John" />, mountNode); } };
