'use strict';
/*global expect, describe, it, before, beforeEach, after, afterEach */
/*global createAdder */

describe("adder", function (){ 
  var adder;

  beforeEach(function() {
    adder = createAdder();
  });

  it("should be capable of adding", function () {
    expect(typeof adder.add === 'function').toBeTruthy();
  });

  it("should add normally", function() {
    function range (start, end, f) {
      var t = [];
      var fp = (f || (function(x) { return x+1; }));
      for (var i = start; i<end; i=fp(i)) {
        t = t + [i];
      }
      return t;
    }
    var inc = function(x) { x = x+4; };
    for (var x in range(-10,10)) {
      for (var y in range(-200,200, inc)) {
        var sum = adder.add(x,y);
        expect(sum).toEqual(x+y);
      }
    }
  });
});
