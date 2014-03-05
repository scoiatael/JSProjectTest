/* jshint node:true */
"use strict";

function createMultiplier () {
  function mult(x,y) {
    return x*y;
  }
  return { 'mult':mult };
}

try {
  module.exports = createMultiplier;
} catch(err) {
  //unable to require/export -> jasmine testing ;)
}
