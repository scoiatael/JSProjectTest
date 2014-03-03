/* jshint node:true */
"use strict";

function createMultiplier () {
  function mult(x,y) {
    return x*y;
  }
  return { 'mult':mult };
}

module.exports = createMultiplier;
