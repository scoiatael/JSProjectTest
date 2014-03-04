describe "coffee adder", ->
  it "should be capable of adding", ->
    adder = new CoffeeAdder();
    expect(typeof adder.add == 'function').toBeTruthy();

  it "should add normally", ->
    adder = new CoffeeAdder();
    for x in [1,2,3,4]
      for y in [1,2,3,4]
        sum = adder.add(x,y);
        expect(sum).toEqual(x+y);

  it "should be capable of subtracting", ->
    adder = new CoffeeAdder();
    expect(typeof adder.minus == 'function').toBeTruthy();

  it "should subtract normally", ->
    adder = new CoffeeAdder();
    for x in [1,2,3,4]
      for y in [1,2,3,4]
        sub = adder.minus(x,y);
        expect(sub).toEqual(x-y);
