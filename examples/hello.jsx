/** @jsx React.DOM */
/*global document*/
"use strict";
var helloNode = document.getElementById("hello");
var tabNode = document.getElementById("tabber");
var React;
var adder;
var multiplier;
var coffeeAdder;

var helloMessage;
var tabber;

try {
  React       = require("react");
  adder       = require("./adder.js")();
  multiplier  = require("./multiplier.js")();
  coffeeAdder = require("./coffeeAdder.js")();
} catch (err) {
  //unable to require/export -> jasmine testing ;)
}

if (typeof React === 'undefined') {
  React = {}
  React.createClass = function (o) { return o; }
}

helloMessage = React.createClass({
  render: function() {
    var x = 2;
    var y = 6;
    return <div className='hello-main' >
      Hello {this.props.name}<br/> 
      {x} + {y} is {adder.add(x,y)} <br/> 
      {x} * {y} is {multiplier.mult(x,y)}<br/>
      {x} - {y} is {coffeeAdder.minus(x,y)}
      </div>;
  }
});

tabber = React.createClass({
  getInitialState: function() {
    return { clicked : 0 };
  },
  handleClick: function(i) {
    console.log('clicked ' + this.props.items[i]);
    this.setState({clicked : i});
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
        <div>
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
        <div className='tabber-items'>
        {this.props.items[this.state.clicked || 0]}
        </div>
      </div>
      );
  }
});

module.exports = function () {
    var tabExampleContent = ['a','b','c'];
    return { 
      'render' : function() { 
        React.renderComponent(<helloMessage name="John" />, helloNode);
        React.renderComponent(<tabber items={tabExampleContent} />, tabNode); } } } ()
