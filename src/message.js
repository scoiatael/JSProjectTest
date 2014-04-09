/**
 * message.js
 * Łukasz Czapliński, ii.uni.wroc.pl
 * 09-04-2014
 * */

function isMessage(d) {
  return (typeof d === 'string') || (typeof d === 'object' && typeof d.chat === 'string');
}

function getMessage(d) {
  if(typeof d === 'string') {
    return d;
  }
  if(typeof d === 'object' && typeof d.chat === 'string') {
    return d.chat;
  }
}

module.exports = { is_message : isMessage, get_message : getMessage };
