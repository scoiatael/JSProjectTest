/** @jsx React.DOM */
/*global document*/
"use strict";
var React = require("react");
var mountNode = document.getElementById('hello');

var helloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

React.renderComponent(<helloMessage name="John" />, mountNode);
