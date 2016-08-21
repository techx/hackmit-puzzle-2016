/* Http
 * @author Pat
 * @version 1.0.2
 * @date 2016/07/12
 * @edit 2016/07/12
 */

var Http = (function() {
  'use strict';

  var exports = {};

  exports.get = function(url, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        if(req.status == 200) {
          var data = null;
          try {
            data = JSON.parse(req.responseText);
          } catch(e) {}
          callback(data);
        } else {
          callback(null);
        }
      }
    };
    req.open("GET", url, true);
    req.send();
  };

  exports.post = function(url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        if(req.status == 200) {
          var data = null;
          try {
            data = JSON.parse(req.responseText);
          } catch(e) {}
          callback(data);
        } else {
          callback(null);
        }
      }
    };
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(data));
  };

  return exports;
})();
