/**
 * execute.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 13-03-2014
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
  return { 
    opt : obj, 
    extension : function (client) {
      function bindCommandFunction (command, id, fn, prettify) {
        if(_.first(command) === id) {
//          console.log('Executing ' + command);
          var r = fn(_.rest(command).join(' '));
          if(typeof prettify === 'function') {
            r = prettify(r);
          }
          return r;
        }
      }

      function constString(str) {
        return function () { return str; };
      }

      function checkExtensions (command, prettify) {
        var c = _.first(command);
        console.log(c);
        if(_.has(client, c)) {
          var r = client[c](_.rest(command)) || 'done';
          if(typeof prettify === 'function') {
            r = prettify(r);
          }
          return r;
        }
      }

      function execute (string_command) {
        var command = string_command.split(' ');
        var ret = null;
        ret = ret || bindCommandFunction(command, 'sendto', function(com) { 
          var c = com.split(' ');
          var receiver = _.first(c);
          var message = _.rest(c).join(' ');
          client.send(receiver, message);
          return receiver + ' : ' + message; });
        ret = ret || bindCommandFunction(command, 'connecto', client.connect, 
            constString('connecting to ' + _.chain(command).rest().first().value()));
        ret = ret || bindCommandFunction(command, 'list', client.get_list);
        ret = ret || bindCommandFunction(command, 'destroy', client.destroy, constString("Bye!"));
        ret = ret || bindCommandFunction(command, 'closec', client.close);
        if(_.has(client, 'set_metadata')) {
          ret = ret || bindCommandFunction(command, 'name', function (name) {
            client.set_metadata(_.extend(client.my_metadata(), { name : name }));
            return 'Your new name: ' + name;
          });
        }
        ret = ret || bindCommandFunction(command, 'id', client.get_id);
        ret = ret || checkExtensions(command);
        ret = ret || ('Unknown command: ' + string_command);
        return ret;
      }

      function accVals () {
        return _.reduce([ 'sendto', 'connecto', 'list', 'destroy', 'closec', 'id', ].concat(
          _.chain(_.keys(client)).value()), function (base, val) {
            return val + ', ' + base;
          }, "");
      }

      return _.extend(client, {execute : execute, accepted_values : accVals});
    }
  };
}

module.exports = makeClientConnection;
/*
, (function () { 
            var r = [];
            if(_.has(client, 'set_metadata')) {
              r = [ 'name' ];
            }
            return r;
          }())
          */
