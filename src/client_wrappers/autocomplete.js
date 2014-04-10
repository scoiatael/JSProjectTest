/**
 * autocomplete.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 18-03-2014
 * */
var _;
var makeClient;
var common;

try {
  _ = require('underscore'); 
  common = require('../common.js');
} catch(err) {
  /**
   * sth
   **/ 
  console.error(err);
}

function makeClientConnection(obj) {
  var new_obj = {
    extensions : (function () {
      var r = ['autocomplete'];
      if(_.has(obj, 'extensions')) {
        r = obj.extensions.concat(r);
      }
      return r;
    }()),
  };
  return {
    opt : common.extend(obj, new_obj),
    extension : function(client) {
      function comp (str) {
        return _.reduce(client.get_list(), function (memo, val, key) {
          if(val.indexOf(str) === 0) {
            memo.push(val);
          }
        }, []);
      }
      return _.extend(client, { complete : comp });
    }
  };
}

module.exports = makeClientConnection;
