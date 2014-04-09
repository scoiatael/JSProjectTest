/**
 * history.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 18-03-2014
 * */
var _;
var Message;

try {
  _ = require('underscore'); 
 Message = require('../message.js'); 
} catch(err) {
  /**
   * sth
   **/ 
  console.error(err);
}

function makeClientConnection(obj) {
  var info = {};
  var is_connected = function() { return false;};
  var new_obj = {
    extensions : (function () {
      var r = ['history'];
      if(_.has(obj, 'extensions')) {
        r = obj.extensions.concat(r);
      }
      return r;
    }()),
    on_data : function(p,d) {
      if(_.has(obj, 'on_data')) {
        obj.on_data.apply(this, arguments);
      }
      if( Message.is_message(d) ) {
        if(!(_.has(info, p) && typeof info[p] !== 'undefined')) {
          info[p] = []; 
        }
        info[p].push(Message.get_message(d));
      }
    },
    on_close : function () {
      var iter;
      if(_.has(obj, 'on_close')) {
        obj.on_close.apply(this, arguments);
      }
      for(iter in info) {
        if(info.hasOwnProperty(iter)) {
          if(!is_connected(iter)) {
            delete info[iter];
          }
        }
      }
    }
  };
  function getHist (p) {
    if(_.has(info, p)) {
      return info[p];
    }
  }
  return {
    opt : _.extend(obj, new_obj),
    extension : function(client) {
      is_connected = client.is_connected;
      return _.extend(client, { get_history : getHist });
    }
  };
}

module.exports = makeClientConnection;
