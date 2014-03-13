/**
 * clientWrapper.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 13-03-2014
 * */
var _;
var makeClient;

try {
  makeClient = require('./client.js');
  _ = require('underscore'); 
} catch(err) {
  /**
   * sth
   **/ 
  console.error(err);
}

/**
 * creates wrapper around client
 * expectes argument identical to that of makeClient from client.js
 * returns function which executes string given as argument
 * availible command:
 * * sendto
 * * connecto
 * * list
 * * destroy
 * * closec
 * * id
 * */
function makeClientConnection(obj) {
  var client = makeClient(obj);
  function bindCommandFunction (command, id, fn) {
    if(_.first(command) === id) {
      return fn(_.rest(command).join(' '));
    }
  }

  function execute (string_command) {
    var command = string_command.split(' ');
    var ret = null;
    ret = ret || bindCommandFunction(command, 'sendto', function(com) { 
      var c = com.split(' ');
      client.send(_.first(c), _.rest(c).join(' ')); });
    ret = ret||bindCommandFunction(command, 'connecto', client.connect);
    ret = ret||bindCommandFunction(command, 'list', client.get_list);
    ret = ret||bindCommandFunction(command, 'destroy', client.destroy);
    ret = ret||bindCommandFunction(command, 'closec', client.close);
    ret = ret||bindCommandFunction(command, 'id', client.get_id);
    console.log('Answer to ' + command + ' : ' + ret);
    return ret;
  }
  return {execute : execute};
}

module.exports = makeClientConnection;
