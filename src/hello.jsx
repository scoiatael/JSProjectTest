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

var helloMessage = React.createClass({
  render: function() {
    var x = 2;
    var y = 6;
    return <div style={{width:300, border:'1px solid black', background:'grey', position:'float'}} >
      Hello {this.props.name}<br/> 
      {x} + {y} is {adder.add(x,y)} <br/> 
      {x} * {y} is {multiplier.mult(x,y)}<br/>
      {x} - {y} is {coffeeAdder.minus(x,y)}
      </div>;
  }
});

var tabber = React.createClass({
  getInitialState: function() {
    return { clicked : 0 };
  },
  handleClick: function(i) {
    console.log('clicked ' + this.props.items[i]);
    this.setState({clicked : i});
  },
  styleButton: function(c,i) {
    var ret = { width:30, color:'white', background:'black'} ;
    if(c === i) {
      ret.color = 'black';
      ret.background = 'white';
    }   
    return ret;
  },
  render: function() {
    return (
      <div style={{position:'float', width:'100', marginLeft:'auto', marginRight:'auto'}}>
        <div>
        {
          this.props.items.map(function(item, i) {
            return (
              <button style={this.styleButton(this.state.clicked, i)}
                    onClick={this.handleClick.bind(this, i)} key={i}>
              {item}
              </button>
              );
          }, this) 
        }
        </div>
        <div style={{height:300, width:300, scale:4}}>
        {this.props.items[this.state.clicked || 0]}
        </div>
      </div>
      );
  }
});

var tabExampleContent = ['a','b','c'];

module.exports = { 
  'render' : function() { 
    React.renderComponent(<helloMessage name="John" />, helloNode);
    React.renderComponent(<tabber items={tabExampleContent} />, tabNode); } };
