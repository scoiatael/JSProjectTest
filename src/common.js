/**
 * common.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 19-03-2014
 * */

var _;

try {
  _ = require('underscore');
} catch(err) {
  console.error('(' + err.name + ')' + err.message);
}

function logError(err) {
  console.error('(' + err.name + ')' + err.message);
}

function check(obj, list) {
  return _.reduce(list, function (memo, item) {
    var has_item = _.has(obj, item);
    if(! has_item) {
      logError(new Error(obj.toString() + ' lacks ' + item));
    }
    return memo && has_item;
  }, true);
}

module.exports = { check_for_properties : check, log_error : logError };
