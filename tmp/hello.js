/** @jsx React.DOM */
/*global document*/
"use strict";
var helloNode = document.getElementById("hello");
var tabNode = document.getElementById("tabber");
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

var helloMessage = React.createClass({displayName: 'helloMessage',
  render: function() {
    var x = 2;
    var y = 6;
    return React.DOM.div(null, "Hello ", this.props.name,React.DOM.br(null), 
      x, " + ", y, " is ", adder.add(x,y), " ", React.DOM.br(null), 
      x, " * ", y, " is ", multiplier.mult(x,y),React.DOM.br(null),
      x, " - ", y, " is ", coffeeAdder.minus(x,y));
  }
});

var tabber = React.createClass({displayName: 'tabber',
  getInitialState: function() {
    return { clicked : 0 };
  },
  handleClick: function(i) {
    console.log('clicked ' + this.props.items[i]);
    this.setState({clicked : i});
  },
  styleButton: function(c,i) {
    var ret = { width:30, color:'white', background:'black' } ;
    if(c === i) {
      ret.color = 'black';
      ret.background = 'white';
    }   
    return ret;
  },
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.div(null, 
        
          this.props.items.map(function(item, i) {
            return (
              React.DOM.button( {style:this.styleButton(this.state.clicked, i),
                    onClick:this.handleClick.bind(this, i), key:i}, 
              item
              )
              );
          }, this) 
        
        ),
        React.DOM.div( {style:{height:300, width:300}}, 
        this.props.items[this.state.clicked || 0]
        )
      )
      );
  }
});

var tabExampleContent = ['a','b','c'];

module.exports = { 
  'render' : function() { 
    React.renderComponent(helloMessage( {name:"John"} ), helloNode);
    React.renderComponent(tabber( {items:tabExampleContent} ), tabNode); } };
