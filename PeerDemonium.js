/* jshint node:true*/
var rendering = require('./tmp/main.js');
var _ = require('underscore');

var nobj = (function (obj) {
  var count = 0;
  return {
    run : function () {
      if(_.has(obj, 'run')) {
        count ++;
        console.log('run ' + count.toString());
        obj.run.apply(this, arguments);
      }
    }
  };
} ( { run : function () { console.log('base run'); } } ));

nobj.run();


rendering();
