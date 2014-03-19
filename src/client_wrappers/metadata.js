/**
 * clientWrapper.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 18-03-2014
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
 * available commands:
 * * sendto
 * * connecto
 * * list
 * * destroy
 * * closec
 * * id
 * */
function makeClientConnection(obj) {
  var client = makeClient(obj);

  return {execute : execute};
}

module.exports = makeClientConnection;
