/**
 * check_status.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 20-03-2014
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
  var start_checking_connections;
  var send;
  var pending_connections = [];
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
      start_checking_connections();
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
          delete pending_connections[who];
        }
      }
    }
  };
  return {
    opt : _.extend(obj, new_obj),
    extension : function(client) {
      function check_connections () {
        _.each(pending_connections, function (val, key) {
          client.close(val);
        });
        _.each(client.get_list(), function(val, key) {
          client.send(val, { type : 'ping' });
          pending_connections.push(val);
        });
      }
      start_checking_connections = function () {
        if(client.is_destroyed()) {
          return;
        }
        check_connections();
        setTimeout(start_checking_connections, 1000);
      };
      send = client.send;
      return client;
    }
  };
}

module.exports = makeClientConnection;
