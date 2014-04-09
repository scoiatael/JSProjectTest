/**
 * client.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 13-03-2014
 * */
/*global Peer*/
var Keys;
var _;

try {
  Keys = require('./keys.js');
  _ = require('underscore'); 
} catch(err) {
  console.error(err);
}

/**
 * returns Peerjs's Peer constructed based on obj
 * obj should have properties
 *
 * obj can have properties
 * * error_handler        - function to forward errors to   - function (err) 
 * * id                   - custom id                       - String
 * * options              - options to pass to Peer creator - Object
 * * on_create            - Peer working                    - function (id)
 * * on_connection        - incoming connection             - function (id) 
 * * on_open              - connection opened               - function (id)
 * * on_data              - process received data           - function (who, what) 
 * * on_close             - when someone closes connection  - function (id)
 *
 * return Object with properties:
 * * connect              - connects to id                  - function (id)
 * * send                 - sends sth to id                 - function (id, sth)
 * * close                - closes connection               - function (id)
 * * get_list             - returns list of ids             - function () -> [String]
 * * destroy              - destroys client                 - function ()
 * * get_id               - returns self id                 - function () -> String
 * * is_destroyed         - checks if client is closed      - function () -> Bool
 * * is_connected         - checks if given client is       - function (d) -> Bool
 *                            connected
 * */
function makeClient (obj) {
  /**
   * key - peer id, value - state 
   * */
  var connections = {};
  var opened = false;
  var peer = (function () {
    var ret;
    var opts = {key : Keys.peerjs};
    if(_.has(obj, 'options')) {
      _.each(obj.options, function(v,k,l) { opts[k] = v; });
    }
    if(_.has(obj, 'id')) { 
      ret = new Peer(obj.id, opts);
    } else { 
      ret = new Peer(opts);
    } 
    return ret;
  } ());

  var myId = 'Disconnected';
  var forwardError;
  var closeConnection;
  var addConnection;
  var sendTo;
  var recvFrom;
  var connectTo;
  var exitGracefully;
  var sanityCheck;
  var leaveMsg = { type : 'leaving' };

  forwardError =  function(err) {
    if(_.has(obj, 'error_handler')) {
      obj.error_handler(err);
    } else {
      console.log(err);
    }
  };
  sanityCheck = function() {
    if(peer.destroyed) { 
      forwardError(new Error('Peer already destroyed'));
    }
  };
  closeConnection =  function(id) {
    if(typeof id === 'undefined') {
      return;
    }
    console.log('closing connection..' + id);
    if(_.has(connections, id)) {
      connections[id].close();
      delete connections[id];
    } else {
      forwardError(new Error('cannot close nonexistant connection: ' + id));
    }
  };
  addConnection =  function(conn, quiet) {
    if(_.has(connections, conn.peer)) {
      /**
       * bad things happened
       * */
      forwardError(new Error('Unexpected happened'));
    }
    conn.on('open', function () {
      if(! quiet) {
        connections[conn.peer] = conn;
      }
      if(_.has(obj, 'on_open')){
        obj.on_open(conn.peer);
      }
    });
    if(! quiet) {
      conn.on('close', closeConnection);
    }
    conn.on('error', forwardError);
    conn.on('data',  _.partial(recvFrom, conn.peer));
    if(_.has(obj, 'on_connection')){
      obj.on_connection(conn.peer);
    }
  };
  sendTo = function(id, what) {
    sanityCheck();
    var done = false;
    if(_.has(connections, id)) {
      connections[id].send(what);
      done = true;
    } else {
      forwardError(new Error('cannot send to nonexistant connection: ' + id));
    }
    return done;
  };
  recvFrom = function(who, what) {
    if(_.has(obj, 'on_data')){
      obj.on_data(who, what);
    } else {
      console.log('got ' + what.toString() + ' from ' + who.toString());
    }
    if(what === leaveMsg) {
      closeConnection(who);
    }
  };
  connectTo = function (id, options) {
    sanityCheck();
    var opts = options;
    if (typeof options === 'undefined') {
      opts = {};  
    }
    var conn = peer.connect(id, opts);
    addConnection(conn, opts.quiet || false);
    return conn;
  };

  exitGracefully = function () {
    console.log('closing..');
    sanityCheck();
    _.reduce(connections, function (memo, val, key) {
      sendTo(key, leaveMsg);
      closeConnection(key);
      return null;
    }, null);
    peer.destroy();
  };

  peer.on('open', function(i) { 
    opened = true; 
    myId = i; 
    if(_.has(obj, 'on_create')){
      obj.on_create(i);
    }
  } );

  peer.on('error', forwardError);
  peer.on('connection', addConnection);

  return { 
    connect : connectTo, 
    send : sendTo, 
    close : closeConnection, 
    get_list : function () { return _.keys(connections); },
    destroy : exitGracefully,
    get_id : function () { return myId; },
    is_destroyed : function () { return peer.destroyed; },
    is_connected : function (d) { return _.has(connections, d); }

  };

}

module.exports = makeClient;
