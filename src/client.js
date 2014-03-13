/**
 * client.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 13-03-2014
 * */
var Peerjs;
var Keys;
var _;

try {
  Keys = require('./keys.js');
  Peerjs = require('../node_modules/peerjs/dist/peer.js');
  _ = require('underscore'); 
} catch(err) {
  /**
   * sth
   **/ 
}

/**
 * returns Peerjs's Peer constructed based on obj
 * obj should have properties
 *
 * obj can have properties
 * * error_handler        - function to forward errors to   - function (err) 
 * * id                   - custom id                       - String
 * * options              - options to pass to Peer creator - Object
 * * on_connection        - incoming connection             - function (id) 
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
      ret = new Peerjs.Peer(obj.id, opts);
    } else { 
      ret = new Peerjs.Peer(opts);
    } 
    return ret;
  } ());

  var myId;
  var forwardError;
  var closeConnection;
  var addConnection;
  var sendTo;
  var recvFrom;
  var connectTo;
  var exitGracefully;
  var sanityCheck;

  sanityCheck = function() {
    if(peer.destroyed) {
      console.log('trying to use peer after destruction');
    }
  };
  forwardError =  function(err) {
    console.log(err);
    if(_.has(obj, 'error_handler')) {
      obj.error_handler(err);
    }
  };
  closeConnection =  function(id) {
    if(_.has(connections, id)) {
      connections[id].close();
      delete connections[id];
    } else {
      console.log('tried to close nonexistant connection with id: ' + id.toString());
    }
  };
  addConnection =  function(conn) {
    if(conn.label !== 'chat' || _.has(connections, conn.peer)) {
      /**
       * bad things happened
       * */
      console.log('unexpected happened');
    }
    conn.on('open', function () {
      connections[conn.peer] = conn;
    });
    conn.on('close', closeConnection);
    conn.on('error', forwardError);
    conn.on('data',  _.partial(recvFrom, conn.peer));
    if(_.has(obj, 'on_connection')){
      obj.on_connection(conn.peer);
    }
  };
  sendTo = function(id, what) {
    sanityCheck();
    var done;
    if(_.has(connections, id)) {
      connections[id].send(what);
      done = true;
    } else {
      console.log('tried to send to nonexistant connection with id: ' + id.toString());
      done = false;
    }
    return done;
  };
  recvFrom = function(who, what) {
    if(_.has(obj, 'on_data')){
      obj.on_data(who, what);
    } else {
      console.log('got ' + what.toString() + ' from ' + who.toString());
    }
  };
  connectTo = function (id) {
    sanityCheck();
    addConnection(peer.connect(id, {
      label : 'chat'
    }));
  };
  exitGracefully = function () {
    sanityCheck();
    peer.destroy();
  };

  peer.on('open', function(i) { opened = true; myId = i; } );
  peer.on('error', forwardError);
  peer.on('connection', addConnection);

  return { 
    connect : connectTo, 
    send : sendTo, 
    close : closeConnection, 
    get_list : function () { return _.keys(connections); },
    destroy : exitGracefully,
    get_id : function () { return myId; }

  };

}

module.exports = makeClient;
