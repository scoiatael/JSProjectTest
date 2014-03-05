describe("coffee adder", function() {
  it("should be capable of adding", function() {
    var adder;
    adder = coffeeAdder();
    return expect(typeof adder.add === 'function').toBeTruthy();
  });
  it("should add normally", function() {
    var adder, sum, x, y, _i, _len, _ref, _results;
    adder = coffeeAdder();
    _ref = [1, 2, 3, 4];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = [1, 2, 3, 4];
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          y = _ref1[_j];
          sum = adder.add(x, y);
          _results1.push(expect(sum).toEqual(x + y));
        }
        return _results1;
      })());
    }
    return _results;
  });
  it("should be capable of subtracting", function() {
    var adder;
    adder = coffeeAdder();
    return expect(typeof adder.minus === 'function').toBeTruthy();
  });
  return it("should subtract normally", function() {
    var adder, sub, x, y, _i, _len, _ref, _results;
    adder = coffeeAdder();
    _ref = [1, 2, 3, 4];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = [1, 2, 3, 4];
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          y = _ref1[_j];
          sub = adder.minus(x, y);
          _results1.push(expect(sub).toEqual(x - y));
        }
        return _results1;
      })());
    }
    return _results;
  });
});
