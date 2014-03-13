'use strict';
/*global expect, describe, it, before, beforeEach, after, afterEach */
/*global createMultiplier */

describe("multiplier", function (){ 
  var multiplier;

  beforeEach(function() {
    multiplier = createMultiplier();
  });

  it("should be capable of multipling", function () {
    expect(typeof multiplier.mult === 'function').toBeTruthy();
  });

  it("should multiply normally", function() {
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
        var multi = multiplier.mult(x,y);
        expect(multi).toEqual(x*y);
      }
    }
  });
});
