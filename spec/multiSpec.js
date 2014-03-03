'use strict';

describe("multiplier", function (){ 
  var multiplier;

  beforeEach(function() {
    multiplier = createMultiplier();
  });

  it("should be capable of multipling", function () {
    expect(typeof multiplier.mult === 'function').toBeTruthy;
  });

  it("should multiply normally", function() {
    function range (start, end, f) {
      var t = []
      for (var i = start; i<end; i=(f || (function(x) { return x+1; }))(i)) {
        t = t + [i];
      };
      return t;
    }
    for (var x in range(-10,10)) {
      for (var y in range(-200,200, function(x) { x = x+4; })) {
        var multi = multiplier.mult(x,y);
        expect(multi).toEqual(x*y);
      }
    };
  });
});
