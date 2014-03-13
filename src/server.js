//var Peerjs;
var Keys;
var _;

try {
  Keys = require('./keys.js');
//  Peerjs = require('../node_modules/peerjs/dist/peer.js');
  _ = require('underscore'); 
} catch(err) {
  /**
   * sth
   **/ 
}

/**
 * returns server constructed based on obj
 * obj should have properties
 * * client               - opened client connection        - Object
 *
 * obj can have properties
 * * error_handler        - function to forward errors to   - function (err) 
 * * id                   - custom id                       - String
 * * options              - options to pass to Peer creator - Object
 * * on_connection        - incoming connection             - function (id) 
 * * on_close             - when someone closes connection  - function (id)
 *
 * return Object with properties:
 * * connect              - connects to id                  - function (id)
 * * send                 - sends sth to id                 - function (id, sth)
 * * close                - closes connection               - function (id)
 * * get_list             - returns list of ids             - function () -> [String]
 * * destroy              - destroys client                 - function ()
 * * get_id               - returns self id                 - function () -> String
 *
 * in addition, server shall accept following strings from connected peers,
 * with following consequences:
 * * 'broadcast $msg'     - server sends $msg to every connected peer, excluding original sender
 * * 'get_peers'          - server replies with list of currently connected peers
 * */
function makeServer (obj) {
  var connections;
  var myId;

  var connectTo;
  var sendTo;
  var closeConnection;
  var exitGracefully;

  return { 
    connect : connectTo, 
    send : sendTo, 
    close : closeConnection, 
    get_list : function () { return _.keys(connections); },
    destroy : exitGracefully,
    get_id : function () { return myId; }
  };

}

module.exports = makeServer;
