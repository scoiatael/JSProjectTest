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
    for (var x in [1,2,3,4]) {
      for (var y in [1,2,3,4]) {
        var sum = adder.add(x,y);
        expect(sum).toEqual(x+y);
      }
    }
  });
});
