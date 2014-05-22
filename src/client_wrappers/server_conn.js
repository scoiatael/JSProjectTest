/**
 * server_conn.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 09-04-2014
 * */
/*global window,alert*/
var _;
var extend_client;
var server_extensions = [];
var common;

try
{
  _ = require('underscore');
  extend_client = require('../clientWrapper.js');
  server_extensions = [
//                        require('../client_wrappers/check_status.js'),
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
var serverNumber = 0;

function makeClientConnection(obj)
{
  var unload = false;
  var serverName = function() { return "server-"+serverNumber.toString(); };
  var knownPeers = {};
  var reliablePeers = {};
  var send = function () { };
  var get_list = function () {
    return {};
  };
  var is_conn = function () {
    return false;
  };
  var connect = function () { };
  var startCheckingForServer;
  var startCheckingPeers;
  var sentRequests = {};
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
    on_close : function (id)
    {
      if(_.has(obj, 'on_close')) {
        obj.on_close.apply(this, arguments);
      }
      delete(sentRequests[id]);

    },
    on_error : function (error)
    {
      if(_.has(obj, 'on_error')) {
        obj.on_close.apply(this, arguments);
      }
      var reg = /Could not connect to peer '(.*)' .+/;
      var m = reg.exec(error.message);
      if(m) {
        alert("Error connecting to " + m);
        delete(sentRequests[m[0]]);
      }
    },
    on_create : function ()
    {
      if(_.has(obj, 'on_create')) {
        obj.on_create.apply(this, arguments);
      }
      _.delay(startCheckingForServer, 3000);
      _.delay(startCheckingPeers, 1000);
    }
  };
  function requestPeers () {
    var ser = serverName();
    if(is_conn(ser)) {
      send(ser, { type : 'peer_request' });
    }
  }

  var checkForServer = function(p) {
    if(! _.has(sentRequests, p)) {
      if(! connect(p)) {
        return;
      }
      sentRequests[p] = (new Date()).getTime();
      setTimeout(function () {
        if(! is_conn(p)) {
          startServer(p);
        }
      }, 5000);
    } else {
      if(! ( is_conn(p) )) {
        connect(p);
      //  console.log('no connection to ' + p + ', reconnecting');
      }
    }
  };

  startCheckingForServer = function () {
    checkForServer(serverName());
    if(!unload) {
      setTimeout(startCheckingForServer, 10000);
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
        if(_.has(client, 'get_metadata')) {
          _.each(list, function (el, k) {
            obj[el] = client.get_metadata(el);
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
      is_conn = function (k) { 
        // Why does it sometimes return value for server instead of client?
        var v1 = client.is_connected(k);
        var v2 = _.contains(client.get_list(), k);
        if(v1 != v2) {
         console.log('mismatch');
        }
       return v1 || v2 ;
      }; 
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

server_extensions.push(makeClientConnection);
startServer = function (name)
{
  console.log('starting server ' + name);
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
      on_error : function (error)
      {
        if(error.type === "unavailable-id") {
          alert("Critical server error");
          serverNumber++;
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

