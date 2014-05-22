/**
 * check_status.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 20-03-2014
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
  'use strict';
  var start_checking_connections = function () { };
  var send = function () {};
  var pending_connections = {};
  var new_obj = {
    extensions : (function () {
      var r = ['check_status'];
      if(_.has(obj, 'extensions')) {
        r = obj.extensions.concat(r);
      }
      return r;
    }()),
    on_open : function() {
      if(_.has(obj, 'on_open')) {
        obj.on_open.apply(this, arguments);
      }
    },
    on_data : function(who, what) {
      if(_.has(obj, 'on_data')) {
        obj.on_data.apply(this, arguments);
      }
      if(_.has(what, 'type')) {
        if(what.type === 'ping') {
          send(who, { type : 'ping-response' } );
        }
        if(what.type === 'ping-response') {
          delete(pending_connections[who]);
        }
      }
    }
  };
  return {
    opt : common.extend(obj, new_obj),
    extension : function(client) {
      function check_connections () {
        _.each(pending_connections, function (val, key) {
          delete(pending_connections[key]);
          console.log('closing ' + key);
          client.close(key);
        });
        _.each(client.get_list(), function(val, key) {
          client.send(val, { type : 'ping' });
          if(! _.contains(pending_connections, val)) {
            pending_connections[val] = (new Date()).getTime();
          }
        });
      }
      start_checking_connections = function () {
        if(client.is_destroyed()) {
          return;
        }
        check_connections();
        setTimeout(start_checking_connections, 5000);
      };
      send = client.send;
      start_checking_connections();
      return client;
    }
  };
}

module.exports = makeClientConnection;
