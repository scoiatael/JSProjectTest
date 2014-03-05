coffeeAdder = () ->
  'add' : (a,b) -> a+b
  'minus' : (a,b) -> a-b 

try
  window.coffeeAdder = coffeeAdder
  module.exports = coffeeAdder 
