'use strict';

function createAdder() {
  function plus(x, y) {
    return x+y;
  }
  return { 'add' : plus };
}
