var XDate = require("xdate");
var xpath = require("./common").xpath 
var Processor = module.exports = {};

Processor.asString = function(v){
  if (v.text){
    if (typeof v.text === "string") return v.text;
    if (typeof v.text === "function") return v.text();
  }
  if (v.value){
    if (typeof v.value === "string") return v.value;
    if (typeof v.value === "function") return v.value();
  }
};

Processor.asBoolean = function(v){
  var t = Processor.asString(v);
  return t==='true';
};

Processor.asFloat = function(v){
  return parseFloat(Processor.asString(v));
};

Processor.asTimestamp = function(v){
  var t = Processor.asString(v);

  var ret = new XDate(0,0,1,0,0,0,0, true); // UTC mode
  
  if (t.length >= 4)
    ret.setFullYear(parseInt(t.slice(0,4)));
  if (t.length >= 6)
    ret.setMonth(parseInt(t.slice(4,6))-1);
  if (t.length >= 8)
    ret.setDate(parseInt(t.slice(6,8)));
  if (t.length >= 10)
    ret.setHours(parseInt(t.slice(8,10)));
  if (t.length >= 12)
    ret.setMinutes(parseInt(t.slice(10,12)));
  if (t.length >= 14)
    ret.setSeconds(parseInt(t.slice(12,14)));
  return ret.toDate();
};

Processor.asTimestampResolution =  function(v){
  var t = Processor.asString(v);
  // TODO handle timezones in dates like 
  // Error: unexpected timestamp length 19540323000000.000-0600:23

  if (t.length===4)
    return 'year';
  if (t.length===6)
    return 'month';
  if (t.length===8)
    return 'day';
  if (t.length===10)
    return 'hour';
  if (t.length===12)
    return 'minute';
  if (t.length===14)
    return 'second';

  return 'subsecond';
};

Processor.pathExists = function(p) {
  return function(v){
    var m = xpath(v,p);
    return (m.length > 0); 
  };
};
