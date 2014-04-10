/**
 * metadata.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 18-03-2014
 * */
var _;
var common;

try {
  _ = require('underscore'); 
  common = require('./common.js');
} catch(err) {
  /**
   * sth
   **/ 
  console.error(err);
}

function makeClientConnection(obj) {
  var info = {};
  var is_connected = function() { return false;};
  var get_list = function () { return []; };
  var send = function () { };
  var myMeta = {};
  var new_obj = {
    extensions : (function () {
      var r = ['metadata'];
      if(_.has(obj, 'extensions')) {
        r = obj.extensions.concat(r);
      }
      return r;
    }()),
    on_data : function(p,d) {
      if(_.has(obj, 'on_data')) {
        obj.on_data.apply(this, arguments);
      }
      if(_.has(d, 'type') && d.type === 'metadata') {
        if(typeof d.metadata !== 'object') {
          /* received sth abnormal
           * Error or just silent ignore?
           * */
          throw new Error("Expected object as metadata prop");
        }
        if(_.has(info, p) && typeof info[p] !== 'undefined') {
          _.extend(info[p], d.metadata);
        } else {
         info[p] = d.metadata; 
        }
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
    },
    on_open : function (p) {
      if(_.has(obj, 'on_open')) {
        obj.on_open.apply(this, arguments);
      }
      send(p, { type : 'metadata', metadata : myMeta });
    }
  };
  function getMeta (p) {
    if(_.has(info, p)) {
      return info[p];
    }
  }
  function setMeta (newMeta) {
    myMeta = newMeta;
    _.each(get_list(), function (el) {
      send(el, { type : 'metadata', metadata: newMeta });
    });
  }
  return {
    opt : common.extend(obj, new_obj),
    extension : function(client) {
      send = client.send;
      get_list = client.get_list;
      is_connected = client.is_connected;
      return _.extend(client, { 
        my_metadata : function () { return myMeta || {}; },
        get_metadata : getMeta, 
        set_metadata : setMeta
      });
    }
  };
}

module.exports = makeClientConnection;
