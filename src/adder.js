/* jshint node:true */
'use strict';

function createAdder() {
  function plus(x, y) {
    return x+y;
  }
  return { 'add' : plus };
}

module.exports = createAdder;
