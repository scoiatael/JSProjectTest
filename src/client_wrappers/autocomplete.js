/**
 * autocomplete.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 18-03-2014
 * */
var _;
var makeClient;

try {
  _ = require('underscore'); 
} catch(err) {
  /**
   * sth
   **/ 
  console.error(err);
}

function makeClientConnection(obj) {
  return {
    opt : obj,
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
