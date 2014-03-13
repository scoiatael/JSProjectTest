/* jshint node:true */
'use strict';

function createAdder() {
  function plus(x, y) {
    return x+y;
  }
  return { 'add' : plus };
}

try {
  module.exports = createAdder;
} catch(err) {
  //unable to export -> jasmine testing ;)
}
