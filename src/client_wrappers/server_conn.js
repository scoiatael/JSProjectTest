/**
 * server_conn.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 09-04-2014
 * */
/*global window*/
var _;
var extend_client;
var server_extensions = [];
var common;

try
{
  _ = require('underscore');
  extend_client = require('../clientWrapper.js');
  server_extensions = [
                        require('../client_wrappers/metadata.js')
                      ];
  common = require('../common.js');
} catch(err)
{
  /**
   * sth
   **/
  console.error(err);
}

var startServer = function () { };
var amServer = false;

function makeClientConnection(obj)
{
  var unload = false;
  var serverNames = ["server-0"];
  var knownPeers = {};
  var reliablePeers = {};
  var send = function () { };
  var get_list = function () {
    return {};
  };
  var get_meta = function () {
    return {};
  };
  var is_conn = function () {
    return false;
  };
  var connect = function () { };
  var startCheckingForServer;
  var startCheckingPeers;
  var new_obj = {
    extensions : (function ()
    {
      var r = ['server_conn'];
      if(_.has(obj, 'extensions')) {
        r = obj.extensions.concat(r);
      }
      return r;
    }()),
    on_data : function(p, d)
    {
      if(_.has(obj, 'on_data')) {
        obj.on_data.apply(this, arguments);
      }
      if(_.has(d, 'type') && d.type === 'peer_update') {
        console.log('got peer update from ' + p);
        console.log(d);
        _.extend(knownPeers, d.ids);
      }
      if(_.has(d, 'type') && d.type === 'peer_request') {
        send(p, {type : 'peer_update', ids : reliablePeers });
      }
    },
    on_close : function ()
    {
      if(_.has(obj, 'on_close')) {
        obj.on_close.apply(this, arguments);
      }
    },
    on_create : function ()
    {
      if(_.has(obj, 'on_create')) {
        obj.on_create.apply(this, arguments);
      }
    //  _.delay(startCheckingForServer, 500);
      _.delay(startCheckingPeers, 500);
    }
  };
  function requestPeers () {
    _.each(serverNames, function (el) {
      if(is_conn(el)) {
        send(el, { type : 'peer_request' });
      }
    });
  }

  var checkForServer = (function () {
    var sentRequests = {};
    return function(p) {
      if(! _.has(sentRequests, p)) {
        connect(p);
        sentRequests[p] = (new Date()).getTime();
        setTimeout(function () {
          if(! is_conn(p)) {
            startServer(p);
          }
        }, 1000);
      } else {
        if(! ( is_conn(p) || _.contains(amServer, p))) {
          connect(p);
          console.log('no connection to ' + p + ', reconnecting');
        }
      }
    };
  }());

  startCheckingForServer = function () {
    _.each(serverNames, function (el) {
      checkForServer(el);
    });
    if(!unload) {
      setTimeout(startCheckingForServer, 3000);
    }
  };
  startCheckingPeers = (function() {
    return function () {
      knownPeers = reliablePeers;
      reliablePeers = {};
      _.each(get_list(), function(v,k) {
        reliablePeers[k] = v;
      });
      if(!unload) {
        requestPeers();
        setTimeout(startCheckingPeers, 10000);
      }
    };
  }());
  window.addEventListener('onbeforeunload', function () {
    unload = true;
  });
  return {
    opt : common.extend(obj, new_obj),
    extension : function(client)
    {
      get_list = function () {
        var list = client.get_list();
        var obj = {};
        if(_.has(client, 'get_meta')) {
          _.each(list, function (el, k) {
            obj[el] = client.get_meta(el);
          });
        } else {
          _.each(list, function (el) {
            obj[el] = {};
          });
        }
        return obj;
      };
      send = client.send;
      connect = client.connect;
      if(_.has(client, 'get_metadata')) {
        get_meta = client.get_metadata;
      }
      is_conn = client.is_connected;
      return _.extend(client, {
        get_peers : function()
        {
          /*var r = [];
          _.each(knownPeers, function (v,k) {
            r.push( v + ' : ' + ( k.name || " " ) );
          });
          return r;*/
          return knownPeers;
        },
        request_peers : requestPeers,
        am_i_server : function ()
        {
          return amServer;
        },
        start_server : startServer,
        reliable_peers : function () 
        {
          console.log(reliablePeers);
          return reliablePeers;
        }
      });
    }
  };
}

startServer = function (name)
{
  console.log('starting server ' + name);
  server_extensions.push(makeClientConnection);
  var conn = extend_client({
    base_opts: {
      on_create : function ()
      {
        if(! amServer ) {
          amServer = [name];
        } else {
          amServer = amServer.push(name);
        }
      },
      id : name
    },
    extension_list: server_extensions
  });
  window.addEventListener('onbeforeunload', function () {
    conn.destroy();
  });
};

module.exports = makeClientConnection;

