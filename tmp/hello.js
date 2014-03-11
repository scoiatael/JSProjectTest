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

helloMessage = React.createClass({displayName: 'helloMessage',
  render: function() {
    var x = 2;
    var y = 6;
    return React.DOM.div( {className:"hello-main"} , 
      "Hello ", this.props.name,React.DOM.br(null), 
      x, " + ", y, " is ", adder.add(x,y), " ", React.DOM.br(null), 
      x, " * ", y, " is ", multiplier.mult(x,y),React.DOM.br(null),
      x, " - ", y, " is ", coffeeAdder.minus(x,y)
      );
  }
});

tabber = React.createClass({displayName: 'tabber',
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
      React.DOM.div( {id:"tabber-div"}, 
        React.DOM.div(null, 
        
          this.props.items.map(function(item, i) {
            return (
              React.DOM.button( {className:"tabber-tab",
                      'data-active':this.buttonActive(this.state.clicked, i),
                      onClick:this.handleClick.bind(this, i), key:i}, 
              item
              )
              );
          }, this) 
        
        ),
        React.DOM.div( {className:"tabber-items"}, 
        this.props.items[this.state.clicked || 0]
        )
      )
      );
  }
});

module.exports = function () {
    var tabExampleContent = ['a','b','c'];
    return { 
      'render' : function() { 
        React.renderComponent(helloMessage( {name:"John"} ), helloNode);
        React.renderComponent(tabber( {items:tabExampleContent} ), tabNode); } } } ()
