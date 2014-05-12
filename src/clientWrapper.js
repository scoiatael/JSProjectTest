/**
 * clientWrapper.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 19-03-2014
 * */

var client;
var _;
var common;

try {
  client = require('./client.js');
  common = require('./common.js');
  _ = require('underscore');
} catch(err) {
  console.log('(' + err.name + ')' + err.message);
}


function clientExtend (obj) {
  common.check_for_properties(obj, ['base_opts', 'extension_list']);
  var opt = obj.base_opts;
  var list = obj.extension_list;
  return (function extend() {
    console.log('Extending client with ' + list.length + ' extensions');
    var fs = [];
    var opts = _.reduce(list, function (memo, item) {
      if(typeof item !== 'function') {
        common.log_error(new Error("bad item on extension list"));
      }
      var r = item(memo);
      common.check_for_properties(r, ['extension', 'opt']);
      fs.push(r.extension);
      return r.opt;
    }, opt);
    if(_.has(opts, 'extensions')) {
      console.log('Used client extensions: ' + opts.extensions);
    }
    return _.reduce(fs, function (memo, item) {
      return item(memo); 
    }, client(opts)); 
  }());
}

module.exports = clientExtend;
