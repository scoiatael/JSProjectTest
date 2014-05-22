/**
 * execute.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 13-03-2014
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
  var new_obj = {
    extensions : (function () {
      var r = ['execute'];
      if(_.has(obj, 'extensions')) {
        r = obj.extensions.concat(r);
      }
      return r;
    }())
  };
  return { 
    opt : common.extend(obj, new_obj), 
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
          var r = client[c](_.rest(command));
          if((! _.isUndefined(r)) && _.has(r, 'toString')) {
            r = r.toString();
          } else {
            r = r || 'done';
          }
          if(typeof prettify === 'function') {
            r = prettify(r);
          }
          return r;
        }
      }
      function accVals () {
        return _.reduce([ 'sendto', 'connecto', 'list', 'destroy', 'closec', 'id', ].concat(
          _.chain(_.keys(client)).value()), function (base, val) {
            return val + ', ' + base;
          }, "");
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
        ret = ret || bindCommandFunction(command, 'getp', client.get_peers, function (obj) {
          var str = "";
          _.each(obj, function (v,k) {
            str = str.concat(k + ': ' + (v.name || ' '));
          });
          return str || 'None';
        });
        ret = ret || bindCommandFunction(command, 'list', client.get_list);
        ret = ret || bindCommandFunction(command, 'destroy', client.destroy, constString("Bye!"));
        ret = ret || bindCommandFunction(command, 'closec', client.close);
        ret = ret || bindCommandFunction(command, 'help', accVals);
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
