var coffeeAdder;

coffeeAdder = function() {
  return {
    'add': function(a, b) {
      return a + b;
    },
    'minus': function(a, b) {
      return a - b;
    }
  };
};

try {
  window.coffeeAdder = coffeeAdder;
  module.exports = coffeeAdder;
} catch (_error) {}
