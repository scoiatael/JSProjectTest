(function() {
  var CoffeeAdder;

  CoffeeAdder = CoffeeAdder = (function() {
    function CoffeeAdder() {}

    CoffeeAdder.prototype['add'] = function(a, b) {
      return a + b;
    };

    CoffeeAdder.prototype['minus'] = function(a, b) {
      return a - b;
    };

    return CoffeeAdder;

  })();

  window.CoffeeAdder = CoffeeAdder;

  module.exports = CoffeeAdder;

}).call(this);
